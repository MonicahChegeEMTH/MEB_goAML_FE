import { Component } from '@angular/core';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-report-handling',
  templateUrl: './report-handling.component.html',
  styleUrls: ['./report-handling.component.scss'],
})
export class ReportHandlingComponent {
  activeTab: 'preview' | 'download' = 'preview';
  firstname: string;
  lastname: string;

  constructor(
      private tokenStorage: TokenStorageService
    ) {}
  
    ngOnInit(): void {
      const user = this.tokenStorage.getUser();
      this.firstname = user.firstname;
      this.lastname = user.lastname;
    }

  downloadXML(): void {
    const xmlContent = `<?xml version="1.0" encoding="UTF-9"?>
<goAML>
  <Report>
    <Info>
      <ReportType>STR</ReportType>
      <ReportPeriodFrom>2023-01-01</ReportPeriodFrom>
      <ReportPeriodTo>2023-01-31</ReportPeriodTo>
      <TotalTransactions>15</TotalTransactions>
      <Sender>
        <AccountNumberType>CIF</AccountNumberType>
        <AccountNumber>1234567890</AccountNumber>
        <AccountName>ABC Bank</AccountName>
      </Sender>
    </Info>
  </Report>
</goAML>`;

    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'report.xml';
    link.click();
  }

  downloadZIP(): void {
    // For demo purposes; in a real app, call backend API to get the ZIP file.
    alert('ZIP download triggered!');
  }
}
