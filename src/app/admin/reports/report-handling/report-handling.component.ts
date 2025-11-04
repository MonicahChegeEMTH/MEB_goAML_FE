import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

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

  constructor(
    private tokenStorage: TokenStorageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    const navData = history.state?.reportData;

    if (navData?.xmlContent) {
      this.xmlContent = navData.xmlContent;
      this.fileName = navData.fileName || 'report.xml';
      this.displayXml(this.xmlContent);
    } else {
      console.warn('No XML content found in navigation state:', navData);
    }
  }

  /** Escapes <, >, &, and quotes to show XML tags as plain text */
  private escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Formats XML with indentation and safely escapes it for display */
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

  /** Pretty-prints XML (adds line breaks + indentation) */
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
        } else if (node.match(/^<\w/)) {
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
    alert('ZIP download triggered!');
  }
}
