import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../../reports/service/reports.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  firstname: string;
  lastname: string;
  displayedColumns: string[] = [
    'id',
    'account_number',
    'reporting_user',
    'date',
    'type',
    'file_name',
    'actions',
  ];
  isLoading = true;
  errorMessage = '';

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private service: ReportsService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    this.fetchReports();
  }

  openReportType(type: string) {
    this.router.navigate(['/auditor/reports/reports'], {
      queryParams: { reportType: type },
    });
  }

  fetchReports(): void {
    this.isLoading = true;
    this.service.getAllReports().subscribe({
      next: (data) => {
        const formattedReports = data.map((item) => ({
          id: item.id,
          account_number: item.account_number,
          date: item.report_date,
          account: item.account_number,
          type: item.report_type,
          file_name: item.file_name,
          reporting_user: item.reporting_user_code,
        }));

        formattedReports.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const recentFive = formattedReports.slice(0, 5);
        this.dataSource = new MatTableDataSource(recentFive);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.errorMessage = 'Failed to load reports. Please try again.';
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
}
