import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-report-handling',
  templateUrl: './report-handling.component.html',
  styleUrls: ['./report-handling.component.scss'],
})
export class ReportHandlingComponent implements OnInit {
  activeTab: 'preview' | 'download' = 'preview';
  firstname: string;
  lastname: string;
  sarPreviewXML: string = ''; // Will hold the XML from backend

  constructor(private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    // Retrieve SAR preview XML from sessionStorage
    const storedXML = sessionStorage.getItem('sarPreviewXML');
    if (storedXML) {
      this.sarPreviewXML = storedXML;
    } else {
      // Fallback in case user navigates directly
      this.sarPreviewXML = `<goAML>
  <Report>
    <Info>
      <Message>No SAR preview available. Please generate a SAR report first.</Message>
    </Info>
  </Report>
</goAML>`;
    }
  }

  downloadXML(): void {
    if (!this.sarPreviewXML) {
      alert('No XML preview found to download.');
      return;
    }

    const blob = new Blob([this.sarPreviewXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SAR_Report.xml';
    link.click();
  }

  downloadZIP(): void {
    // In a real implementation, call backend API to download the ZIP file.
    alert('ZIP download triggered!');
  }
}
