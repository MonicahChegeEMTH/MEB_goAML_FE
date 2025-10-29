import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../service/reports.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'date',
    'account',
    'type',
    'amount'
  ]
  selectedReportType: string | null = null;
  pagedReports: any[] = [];
  startDate: string = '';
  endDate: string = '';
  accountNumber: string = '';
  customerId: string = '';
  firstname: string;
  lastname: string;
  searchText: string = '';
  isLoading = true;
  errorMessage = '';

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

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private service: ReportsService
  ) {}

  ngOnInit(): void {
    this.fetchReports()
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

  fetchReports(): void {
     this.service.getAuditLogs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;

        // Re-attach paginator & sort AFTER async data load
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      error: (err) => {
        console.error('Error fetching audit logs', err);
        this.errorMessage = 'Failed to load audit logs. Please try again.';
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch() {
    this.searchText = '';
    const event = { target: { value: '' } } as unknown as Event;
    this.applyFilter(event);
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.setPagedData(startIndex, endIndex);
  }

  private setPagedData(startIndex: number, endIndex: number): void {
    this.pagedReports = this.reports.slice(startIndex, endIndex);
  }

   downloadPDF() {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Reports', 14, 15);
  
      autoTable(doc, {
        head: [
          [
            'Date',
            'Account',
            'Type',
            'Amount',
          ],
        ],
        body: this.dataSource.data.map((row: any) => [
          row.date,
          row.account,
          row.type,
          row.amount
        ]),
        startY: 25,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [63, 81, 181] },
      });
  
      doc.save('reports-records.pdf');
    }
}
