import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../../reports/service/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

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
  totalReports: number = 0;
  isDownloading: boolean = false;
  isLoadingPreview: { [key: string]: boolean } = {};
  isLoadingDownload: { [key: string]: boolean } = {};

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private service: ReportsService,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    this.fetchReports();
    this.fetchReportCount();
  }

  openReportType(type: string) {
    this.router.navigate(['/admin/reports/reports'], {
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

  fetchReportCount(): void {
    this.service.reportCount().subscribe({
      next: (res) => {
        this.totalReports = res.totalReports;
      },
      error: (err) => {
        console.error('Error fetching report count:', err);
        this.totalReports = 0;
      },
    });
  }

  downloadReport(reportId: string): void {
    if (this.isLoadingDownload[reportId]) return;
    this.isLoadingDownload[reportId] = true;

    this.service.downloadReport(reportId).subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${reportId}.xml`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Download failed:', error);
        this.snackbar.showNotification(
          'snackbar-danger',
          'Failed to download report.'
        );
      },
      complete: () => {
        this.isLoadingDownload[reportId] = false;
      }
    });
  }

  previewReport(reportId: string): void {
    if (this.isLoadingPreview[reportId]) return;
    this.isLoadingPreview[reportId] = true;

    this.service.downloadReport(reportId).subscribe({
      next: (response: any) => {
        if (response?.xmlContent || response?.xmlDocument) {
          const xml = response.xmlContent || response.xmlDocument;

          this.router.navigate(['/admin/reports/reports-handling'], {
            state: {
              reportData: {
                xmlContent: xml,
                fileName: `report-${reportId}.xml`,
                reportId: reportId,
              },
            },
          });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            const xmlText = reader.result as string;
            this.router.navigate(['/admin/reports/reports-handling'], {
              state: {
                reportData: {
                  xmlContent: xmlText,
                  fileName: `report-${reportId}.xml`,
                  reportId: reportId,
                },
              },
            });
          };
          reader.readAsText(response);
        }
      },
      error: (error) => {
        console.error('Preview failed:', error);
        this.snackbar.showNotification(
          'snackbar-danger',
          'Failed to preview report.'
        );
        this.isLoadingPreview[reportId] = false;
      },
      complete: () => {
        this.isLoadingPreview[reportId] = false;
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
