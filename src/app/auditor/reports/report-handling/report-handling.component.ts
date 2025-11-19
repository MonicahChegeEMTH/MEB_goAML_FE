import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../service/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-report-handling',
  templateUrl: './report-handling.component.html',
  styleUrls: ['./report-handling.component.scss'],
})
export class ReportHandlingComponent {
  activeTab: 'preview' | 'download' = 'preview';
  isLoadingDownload: { [key: string]: boolean } = {};
  firstname: string = '';
  lastname: string = '';
  xmlContent: string = '';
  formattedXml: SafeHtml = '';
  fileName: string = 'report.xml';
  editMode: boolean = false;
  reportId: string = '';
  isSaving: boolean = false;
  isDownloadingXML = false;
  isDownloadingZIP: { [key: string]: boolean } = {};

  constructor(
    private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    const navData = history.state?.reportData;

    if (navData?.xmlContent) {
      this.xmlContent = navData.xmlContent;
      this.fileName = navData.fileName || 'report.xml';
      this.reportId = navData.reportId || '';
      this.displayXml(this.xmlContent);
    } else {
      console.warn('No XML content found in navigation state:', navData);
    }
  }

  private highlightEmptyFields(xml: string): string {
    return xml.replace(
      /(&lt;\w+&gt;)(\s*?)(&lt;\/\w+&gt;)/g,
      `<span class="missing-field">$1$2$3</span>`
    );
  }

  private highlightNullFields(xml: string): string {
    return xml.replace(
      /(&lt;\w+&gt;)\(null\)(&lt;\/\w+&gt;)/g,
      `<span class="missing-field">$1(null)$2</span>`
    );
  }

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private displayXml(xml: string): void {
    let formatted = this.formatXml(xml);
    let escaped = this.escapeXml(formatted);
    let highlighted = this.highlightEmptyFields(escaped);
    let highlightedNull = this.highlightNullFields(highlighted);

    this.formattedXml = this.sanitizer.bypassSecurityTrustHtml(
      `<pre class="xml-preview-container">
      <style>
        .missing-field {
          background-color: #ffdddd;
          color: red;
          border-radius: 4px;
          padding: 2px 4px;
        }
      </style>
      ${highlightedNull}
    </pre>`
    );
  }

  loadXml(reportData: any): void {
    this.xmlContent = reportData.xmlContent;
    this.fileName = reportData.fileName || 'report.xml';
    this.displayXml(this.xmlContent);
  }

  formatXml(xml: string): string {
    const PADDING = '  ';
    let pad = 0;
    let result = '';

    xml = xml.replace(/>([^<]+)</g, (_, text) => `>${text.trim()}<`);
    xml = xml.replace(/>\s+</g, '><').trim();

    const tokens = xml.split(/(<[^>]+>)/).filter((t) => t.length > 0);

    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index];
      const isOpeningTag = /^<[^/!][^>]*>$/.test(token);
      const isClosingTag = /^<\/[^>]+>$/.test(token);
      const isSelfClosing = /^<[^>]+\/>$/.test(token);

      const next = tokens[index + 1];
      const nextNext = tokens[index + 2];

      if (isClosingTag) {
        pad = Math.max(pad - 1, 0);
        result += PADDING.repeat(pad) + token + '\n';
        continue;
      }

      if (isOpeningTag) {
        const nextIsClosing = next && /^<\/[^>]+>$/.test(next);

        if (nextIsClosing) {
          result += PADDING.repeat(pad) + token + next + '\n';
          index += 1;
          continue;
        }

        const hasTextContent = next && !/^</.test(next);
        const nextNextIsClosing = nextNext && /^<\/[^>]+>$/.test(nextNext);

        if (hasTextContent && nextNextIsClosing) {
          const trimmedContent = next.trim();
          result +=
            PADDING.repeat(pad) + token + trimmedContent + nextNext + '\n';
          index += 2;
          continue;
        }

        result += PADDING.repeat(pad) + token;
        if (!hasTextContent) result += '\n';

        pad++;
        continue;
      }

      if (isSelfClosing) {
        result += PADDING.repeat(pad) + token + '\n';
        continue;
      }

      result += token;
    }

    return result.trim();
  }

  downloadXML(): void {
    if (this.isDownloadingXML) return;
    this.isDownloadingXML = true;

    try {
      const blob = new Blob([this.xmlContent], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      const backendMessage =
        error?.error?.message ||
        error?.message ||
        'Failed to download XML file.';
      this.snackbar.showNotification('snackbar-danger', backendMessage);
    } finally {
      setTimeout(() => (this.isDownloadingXML = false), 1000);
    }
  }

  downloadZIP(reportId: string): void {
    if (this.isDownloadingZIP[reportId]) return;
    this.isDownloadingZIP[reportId] = true;

    this.reportService.downloadZipReport(reportId).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        const backendMessage =
          error?.error?.message ||
          error?.message ||
          'Failed to download zipped report';
        this.snackbar.showNotification('snackbar-danger', backendMessage);
      },
      complete: () => {
        this.isDownloadingZIP[reportId] = false;
      },
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;

    if (this.editMode) {
      let formatted = this.formatXml(this.xmlContent);
      let escaped = this.escapeXml(formatted);
      let highlighted = this.highlightEmptyFields(escaped);

      this.formattedXml = this.sanitizer.bypassSecurityTrustHtml(
        `<style>
        .missing-field {
          background-color: #ffdddd;
          color: black;
          border-radius: 4px;
          padding: 2px 4px;
        }
      </style>
      ${highlighted}`
      );
    } else {
      this.displayXml(this.xmlContent);
    }
  }

  onXmlEdit(event: Event): void {
    const target = event.target as HTMLElement;

    this.xmlContent = target.innerText || target.textContent || '';
  }

  saveEditedXml(): void {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlContent, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror')[0];

      if (parserError) {
        this.snackbar.showNotification(
          'snackbar-error',
          'Invalid XML. Please fix before saving.'
        );
        return;
      }

      if (!this.reportId) {
        this.snackbar.showNotification(
          'snackbar-error',
          'Report ID missing. Cannot update.'
        );
        return;
      }

      this.isSaving = true;

      this.reportService
        .updateReport(this.reportId, this.xmlContent)
        .subscribe({
          next: () => {
            this.displayXml(this.xmlContent);
            this.editMode = false;
            this.snackbar.showNotification(
              'snackbar-success',
              'Report updated successfully!'
            );
            this.isSaving = false;
          },
          error: (err) => {
            console.error('Error updating report:', err);
            this.snackbar.showNotification(
              'snackbar-error',
              'Failed to update the report. Please try again.'
            );
            this.isSaving = false;
          },
        });
    } catch (err) {
      console.error('Error parsing XML:', err);
      this.snackbar.showNotification(
        'snackbar-error',
        'Unexpected error while saving changes.'
      );
      this.isSaving = false;
    }
  }
}
