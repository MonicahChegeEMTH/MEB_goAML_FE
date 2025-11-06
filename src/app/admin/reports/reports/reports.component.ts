import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { ReportsService } from '../service/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'account_number',
    'reporting_user',
    'date',
    'type',
    'file_name',
    'actions',
  ];
  isLoadingPreview: { [key: string]: boolean } = {};
  isLoadingDownload: { [key: string]: boolean } = {};
  selectedReportType: string | null = null;
  filterForm!: FormGroup;
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
  reports: any[] = [];
  selectedIdType: string = 'nationalId';
  idPlaceholder: string = 'Enter ID number';
  selectedAction = '';
  selectedIndicators: string[] = [];
  identificationType: string = '';
  identificationNumber: string = '';
  sarReason: string = '';
  isDownloading: boolean = false;
  accStmtAccount: string = '';
  accStmtFrom: string = '';
  accStmtTo: string = '';
  strTranId: string = '';
  strTranDate: string = '';
  strAccountNo: string = '';
  strReason: string = '';
  strAction: string = '';
  strComments: string = '';
  selectedStrIndicators: string[] = [];

  sarActions = ['Freeze Account', 'Close Account', 'Monitor Transactions'];
  sarIndicators = [
    'Unusual Transactions',
    'Suspicious Transfers',
    'Large Cash Deposits',
  ];

  strIndicators = [
    'Unusual Transactions',
    'Suspicious Transfers',
    'Large Cash Deposits',
  ];

  idTypes = [
    { value: 'nationalId', viewValue: 'National ID' },
    { value: 'passport', viewValue: 'Passport' },
    { value: 'drivingLicense', viewValue: 'Driving License' },
    { value: 'alienId', viewValue: 'Alien ID' },
  ];

  showReportForm(type: string) {
    this.selectedReportType = type;
  }

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tokenStorage: TokenStorageService,
    private service: ReportsService,
    private router: Router,
    private snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchReports();
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

  initForm() {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      accountNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      identificationType: ['nationalId'],
      identificationNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      sarReason: [''],
      selectedAction: [''],
      selectedIndicators: [[]],
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  showCommonFilters(): boolean {
    return (
      this.selectedReportType !== 'SAR' &&
      this.selectedReportType !== 'AccStmt' &&
      this.selectedReportType !== 'STR'
    );
  }

  onIdTypeChange(type: string): void {
    switch (type) {
      case 'passport':
        this.idPlaceholder = 'Enter passport number';
        break;
      case 'drivingLicense':
        this.idPlaceholder = 'Enter driving license number';
        break;
      case 'alienId':
        this.idPlaceholder = 'Enter alien ID number';
        break;
      default:
        this.idPlaceholder = 'Enter ID number';
    }
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

        this.dataSource = new MatTableDataSource(formattedReports);
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
      head: [['Account No', 'Report Type', 'Generated By', 'Generated At']],
      body: this.dataSource.data.map((row: any) => [
        row.account,
        row.type,
        row.reporting_user,
        row.date,
      ]),
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] },
    });

    doc.save('reports-records.pdf');
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
                fileName: `report_${reportId}.xml`,
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
                  fileName: `report_${reportId}.xml`,
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
      },
    });
  }

  downloadSARReport() {
    if (
      !this.accountNumber ||
      !this.sarReason ||
      !this.selectedAction ||
      this.selectedIndicators.length === 0
    ) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all SAR fields.'
      );
      return;
    }

    console.log('Downloading SAR report with:', {
      accountNumber: this.accountNumber,
      sarReason: this.sarReason,
      selectedAction: this.selectedAction,
      selectedIndicators: this.selectedIndicators,
    });

    this.isDownloading = true;

    this.service
      .downloadSARReport(
        this.accountNumber,
        this.sarReason,
        this.selectedAction,
        this.selectedIndicators
      )
      .subscribe({
        next: (response) => {
          console.log('SAR report response:', response);
          sessionStorage.setItem('sarPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'SAR report generated successfully.'
          );
          this.router.navigate(['/admin/reports/reports-handling'], {
            state: {
              reportData: {
                xmlContent: response.xmlContent,
                fileName: response.fileName,
                reportId: response.id,
              },
            },
          });
        },
        error: (error) => {
          this.snackbar.showNotification(
            'snackbar-danger',
            'Failed to generate SAR report. Please try again.'
          );
          console.error('Failed to download SAR report:', error);
          this.isDownloading = false;
        },
        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  downloadAccountStatement() {
    if (!this.accStmtAccount || !this.accStmtFrom || !this.accStmtTo) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all Account Statement fields.'
      );
      return;
    }

    this.isDownloading = true;
    const formattedFrom = new Date(this.accStmtFrom)
      .toISOString()
      .split('T')[0];
    const formattedTo = new Date(this.accStmtTo).toISOString().split('T')[0];

    this.service
      .downloadAccStmt(this.accStmtAccount, formattedFrom, formattedTo)
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `AccountStatement_${this.accStmtAccount}_${formattedFrom}_${formattedTo}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          this.snackbar.showNotification(
            'snackbar-success',
            'Account statement downloaded successfully.'
          );
          this.router.navigate(['/admin/reports/reports-handling'], {
            state: { reportData: response },
          });
        },
        error: (error) => {
          console.error('Error downloading account statement:', error);
          this.snackbar.showNotification(
            'snackbar-danger',
            'Failed to download account statement.'
          );
        },
        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  downloadStrReport() {
    this.markFormGroupTouched(this.filterForm);

    if (!this.strAccountNo || !this.strTranId || !this.strTranDate) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all required STR fields.'
      );
      return;
    }

    this.isDownloading = true;
    const formattedTo = this.strTranDate
      ? formatDate(this.strTranDate, 'dd-MMM-yy', 'en').toLowerCase()
      : null;

    this.service
      .downloadStrReport(
        this.strTranId,
        formattedTo,
        this.strAccountNo,
        this.strReason,
        this.strAction,
        this.strComments,
        this.selectedStrIndicators
      )
      .subscribe({
        next: (response) => {
          console.log('STR report response:', response);
          sessionStorage.setItem('strPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'STR report generated successfully.'
          );

          this.router.navigate(['/admin/reports/reports-handling'], {
            state: {
              reportData: {
                xmlContent: response.xmlContent,
                fileName: response.fileName,
                reportId: response.id,
              },
            },
          });
        },
        error: (error) => {
          this.snackbar.showNotification(
            'snackbar-danger',
            'Failed to generate STR report. Please try again.'
          );
          console.error('Failed to download STR report:', error);
          this.isDownloading = false;
        },
        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
