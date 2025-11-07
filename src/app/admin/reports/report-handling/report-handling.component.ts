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
  firstname: string = '';
  lastname: string = '';
  xmlContent: string = '';
  formattedXml: SafeHtml = '';
  fileName: string = 'report.xml';
  editMode: boolean = false;
  reportId: string = '';
  isSaving: boolean = false;

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

  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private displayXml(xml: string): void {
    const formatted = this.formatXml(xml);
    const escaped = this.escapeXml(formatted);
    this.formattedXml = this.sanitizer.bypassSecurityTrustHtml(
      `<pre>${escaped}</pre>`
    );
  }

  loadXml(reportData: any): void {
    this.xmlContent = reportData.xmlContent;
    this.fileName = reportData.fileName || 'report.xml';
    this.displayXml(this.xmlContent);
  }

  formatXml(xml: string): string {
    const PADDING = '  ';
    const reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    let pad = 0;
    return xml
      .split('\r\n')
      .map((node) => {
        let indent = '';
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = PADDING.repeat(pad);
        } else if (node.match(/^<\/\w/)) {
          pad = Math.max(pad - 1, 0);
          indent = PADDING.repeat(pad);
        } else if (node.match(/^<\w([^>]*[^\/])?>.*$/)) {
          indent = PADDING.repeat(pad);
          pad++;
        } else {
          indent = PADDING.repeat(pad);
        }
        return indent + node;
      })
      .join('\r\n');
  }

  downloadXML(): void {
    const blob = new Blob([this.xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadZIP(): void {
    this.snackbar.showNotification(
      'snackbar-success',
      'ZIP download triggered!'
    );
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.xmlContent = this.formatXml(this.xmlContent);
    } else {
      this.displayXml(this.xmlContent);
    }
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

      console.log('Updating report with ID:', this.reportId);

      this.isSaving = true;

      this.reportService
        .updateReport(this.reportId, this.xmlContent)
        .subscribe({
          next: (res) => {
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
