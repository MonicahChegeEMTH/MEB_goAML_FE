import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Route } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  selectedReportType: string | null = null;
  pagedReports: any[] = [];
  startDate: string = '';
  endDate: string = '';
  accountNumber: string = '';
  customerId: string = '';
  firstname: string;
  lastname: string;

  showReportForm(type: string) {
    this.selectedReportType = type;
  }

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

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private route: ActivatedRoute, private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.route.queryParams.subscribe((params) => {
      const type = params['reportType'];
      if (type) {
        this.selectedReportType = type;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.setPagedData(startIndex, endIndex);
  }

  private setPagedData(startIndex: number, endIndex: number): void {
    this.pagedReports = this.reports.slice(startIndex, endIndex);
  }
}
