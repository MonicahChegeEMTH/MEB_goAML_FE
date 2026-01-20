import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../service/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { debounceTime, Subject } from 'rxjs';

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
  reportType: string = '';
  isReadOnly: boolean;
  originalXmlContent: string = '';
  private xmlEditSubject = new Subject<string>();
  undoStack: string[] = [];

  constructor(
    private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private reportService: ReportsService,
    private snackbar: SnackbarService,
  ) {}

  ngOnInit(): void {
    this.xmlEditSubject.pipe(debounceTime(500)).subscribe((xml) => {
      // Only push if changed
      if (
        !this.undoStack.length ||
        this.undoStack[this.undoStack.length - 1] !== xml
      ) {
        this.undoStack.push(xml);

        // Limit stack size
        if (this.undoStack.length > 50) this.undoStack.shift();
      }
    });

    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    const navData = history.state?.reportData;

    if (navData) {
      this.reportType =
        navData.report_type?.toUpperCase() ||
        navData.reportType?.toUpperCase() ||
        null;
      this.xmlContent = navData.xmlContent;
      this.originalXmlContent = navData.xmlContent;
      this.fileName = navData.fileName || 'report.xml';
      this.reportId = navData.reportId || '';

      console.log('DEBUG REPORT TYPE →', this.reportType);
      console.log('NAV DATA →', navData);

      this.isReadOnly = this.reportType === 'ACC_STMT';

      this.displayXml(this.xmlContent);
    } else {
      console.warn('No XML content found in navigation state:', navData);
    }
  }

  private highlightEmptyFields(xml: string): string {
    return xml.replace(
      /(&lt;\w+&gt;)(\s*?)(&lt;\/\w+&gt;)/g,
      `<span class="missing-field">$1$2$3</span>`,
    );
  }

  private highlightNullFields(xml: string): string {
    return xml.replace(
      /(&lt;\w+&gt;)\(null\)(&lt;\/\w+&gt;)/g,
      `<span class="missing-field">$1(null)$2</span>`,
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
      `<pre class="xml-preview-container"
        style="white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; margin:0;">
     <style>
       .missing-field {
         background-color: #ffdddd;
         color: red;
         border-radius: 4px;
         padding: 2px 4px;
       }
     </style>
     ${highlightedNull}
  </pre>`,
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
    if (this.isReadOnly) return;
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
      ${highlighted}`,
      );
    } else {
      this.displayXml(this.xmlContent);
    }
  }

  // onXmlEdit(event: Event): void {
  //   const target = event.target as HTMLElement;

  //   this.xmlContent = target.innerText || target.textContent || '';
  // }
  private pushToUndoStack(xml: string) {
    if (
      !this.undoStack.length ||
      this.undoStack[this.undoStack.length - 1] !== xml
    ) {
      this.undoStack.push(xml);
      if (this.undoStack.length > 50) this.undoStack.shift();
    }
  }
  

  onXmlEdit(event: Event) {
    const target = event.target as HTMLElement;
    const newXml = target.innerText || target.textContent || '';

    // Push immediately if stack empty
    if (!this.undoStack.length) this.pushToUndoStack(this.xmlContent);

    // Push if punctuation/space
    const lastChar = newXml.slice(-1);
    if ([' ', '\n', '.', ',', ';'].includes(lastChar)) {
      this.pushToUndoStack(this.xmlContent);
    }

    // Also push after 500ms pause (debounce)
    this.xmlEditSubject.next(newXml);

    this.xmlContent = newXml;
  }

  private highlightXml(xml: string): string {
    const formatted = this.formatXml(xml);
    const escaped = this.escapeXml(formatted);
    const highlighted = this.highlightEmptyFields(escaped);
    const highlightedNull = this.highlightNullFields(highlighted);

    return `<style>
    .missing-field {
      background-color: #ffdddd;
      color: red;
      border-radius: 4px;
      padding: 2px 4px;
    }
  </style>
  ${highlightedNull}`;
  }

  undoXmlStep(): void {
    if (this.undoStack.length === 0) return;

    const previousXml = this.undoStack.pop()!;
    this.xmlContent = previousXml;

    // Re-render highlights properly via Angular binding
    this.formattedXml = this.sanitizer.bypassSecurityTrustHtml(
      this.highlightXml(this.xmlContent),
    );

    this.snackbar.showNotification('snackbar-info', 'Undo step applied.');
  }

  saveEditedXml(): void {
    if (this.isReadOnly) {
      this.snackbar.showNotification(
        'snackbar-error',
        'Editing is disabled for Account Statement reports.',
      );
      return;
    }
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(this.xmlContent, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror')[0];

      if (parserError) {
        this.snackbar.showNotification(
          'snackbar-error',
          'Invalid XML. Please fix before saving.',
        );
        return;
      }

      if (!this.reportId) {
        this.snackbar.showNotification(
          'snackbar-error',
          'Report ID missing. Cannot update.',
        );
        return;
      }

      this.isSaving = true;

      this.reportService
        .updateReport(this.reportId, this.xmlContent)
        .subscribe({
          next: () => {
            this.originalXmlContent = this.xmlContent;
            this.displayXml(this.xmlContent);
            this.editMode = false;
            this.snackbar.showNotification(
              'snackbar-success',
              'Report updated successfully!',
            );
            this.isSaving = false;
          },
          error: (err) => {
            console.error('Error updating report:', err);
            this.snackbar.showNotification(
              'snackbar-error',
              'Failed to update the report. Please try again.',
            );
            this.isSaving = false;
          },
        });
    } catch (err) {
      console.error('Error parsing XML:', err);
      this.snackbar.showNotification(
        'snackbar-error',
        'Unexpected error while saving changes.',
      );
      this.isSaving = false;
    }
  }

  undoXmlChanges(): void {
    // Restore original XML
    this.xmlContent = this.originalXmlContent;

    // Re-render editor with original XML
    const formatted = this.formatXml(this.xmlContent);
    const escaped = this.escapeXml(formatted);
    const highlighted = this.highlightEmptyFields(escaped);

    this.formattedXml = this.sanitizer.bypassSecurityTrustHtml(
      `<style>
      .missing-field {
        background-color: #ffdddd;
        color: black;
        border-radius: 4px;
        padding: 2px 4px;
      }
    </style>
    ${highlighted}`,
    );

    this.snackbar.showNotification('snackbar-info', 'Changes reverted.');
  }
}
