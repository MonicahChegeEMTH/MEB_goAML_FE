import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  firstname: string;
  lastname: string;
  reports = [
    {
      date: '12/03/2025',
      account: '1234567890',
      type: 'Deposit',
      amount: 'KES 10,000.00',
    },
    {
      date: '09/02/2025',
      account: '1234567890',
      type: 'Withdrawal',
      amount: 'KES 2,500.00',
    },
    {
      date: '28/01/2025',
      account: '1234567890',
      type: 'Transfer',
      amount: 'KES 5,000.00',
    },
    {
      date: '15/01/2025',
      account: '1234567890',
      type: 'Deposit',
      amount: 'KES 8,000.00',
    },
  ];

  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;
  }

  openReportType(type: string) {
    this.router.navigate(['/auditor/reports/reports'], {
      queryParams: { reportType: type },
    });
  }
}
