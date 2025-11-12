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
  starTranId: string = '';
  strTranDate: string = '';
  starTranDate: string = '';
  strAccountNo: string = '';
  strReason: string = '';
  starReason: string = '';
  strAction: string = '';
  starAction: string = '';
  strComments: string = '';
  starComments: string = '';
  selectedStrIndicators: string[] = [];
  selectedStarIndicators: string[] = [];
  ctrTranType: string = '';
  ctrTranId: string = '';
  ctrTranDate: string = '';
  today = new Date();

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

  starIndicators = [
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
  @ViewChild('exporter', { static: false }) exporter: any;
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
      this.selectedReportType !== 'STR' &&
      this.selectedReportType !== 'STAR' &&
      this.selectedReportType !== 'CTR'
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
        const formattedReports = data.map((item) => {
          const formattedDate = formatDate(
            item.report_date,
            'MMM d, y, h:mm:ss a',
            'en-US'
          );

          return {
            id: item.id,
            account_number: item.account_number,
            date: formattedDate,
            account: item.account_number,
            type: item.report_type,
            file_name: item.file_name,
            reporting_user: item.reporting_user_code,
          };
        });

        this.dataSource = new MatTableDataSource(formattedReports);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        /** Custom filtering logic (see step 2) */
        this.dataSource.filterPredicate = this.customFilter();

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
        this.errorMessage = 'Failed to load reports. Please try again.';
        this.isLoading = false;
      },
    });
  }

  customFilter() {
    return (data: any, filter: string): boolean => {
      const lowerCaseFilter = filter.trim().toLowerCase();

      const combinedData = `
      ${data.id}
      ${data.account_number}
      ${data.reporting_user}
      ${data.date}
      ${data.type}
      ${data.file_name}
    `.toLowerCase();

      return combinedData.includes(lowerCaseFilter);
    };
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

  getCurrentDateString(): string {
    return formatDate(new Date(), 'yyyyMMdd', 'en-US');
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reports', 14, 15);

    const exportData =
      this.dataSource.filteredData.length > 0
        ? this.dataSource.filteredData
        : this.dataSource.data;

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

    const fileName = `Report_${this.getCurrentDateString()}.pdf`;
    doc.save(fileName);
  }

  exportXlsx(): void {
    if (!this.exporter) {
      console.error('Exporter not found!');
      return;
    }

    const fileName = `Report_${this.getCurrentDateString()}`;
    const exportData =
      this.dataSource.filteredData.length > 0
        ? this.dataSource.filteredData
        : this.dataSource.data;

    this.exporter.exportTable('xlsx', {
      fileName,
      sheet: 'sheet1',
      dataSource: exportData,
    });
  }

  previewReport(reportId: string): void {
    if (this.isLoadingPreview[reportId]) return;
    this.isLoadingPreview[reportId] = true;

    this.service.downloadReport(reportId).subscribe({
      next: (response: any) => {
        if (response?.xmlContent || response?.xmlDocument) {
          const xml = response.xmlContent || response.xmlDocument;

          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
            this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
    this.markFormGroupTouched(this.filterForm);
    if (!this.accStmtAccount || !this.accStmtFrom || !this.accStmtTo) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all required account fields'
      );
    }

    this.isDownloading = true;
    const formattedFrom = new Date(this.accStmtFrom)
      .toISOString()
      .split('T')[0];
    const formattedTo = new Date(this.accStmtTo).toISOString().split('T')[0];
    this.service
      .downloadAccStmt(this.accStmtAccount, formattedFrom, formattedTo)
      .subscribe({
        next: (response) => {
          sessionStorage.setItem('accStmtPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'Account Statement report generated successfully.'
          );
          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
          const backendMessage =
            error?.error?.message ||
            error?.message ||
            'Failed to generete account statement report';
          this.snackbar.showNotification('snackbar-danger', backendMessage);
          this.isDownloading = false;
        },
        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  downloadStrReport() {
    this.markFormGroupTouched(this.filterForm);

    if (!this.strTranId || !this.strTranDate) {
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

          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
          const backendMessage =
            error?.error?.message ||
            error?.message ||
            'Failed to generate STR report. Please try again.';
          this.snackbar.showNotification('snackbar-danger', backendMessage);
          this.isDownloading = false;
        },
        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  downloadStarReport() {
    this.markFormGroupTouched(this.filterForm);

    if (!this.starTranId || !this.starTranDate) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all required STAR fields.'
      );
      return;
    }

    this.isDownloading = true;
    const formattedTo = this.starTranDate
      ? formatDate(this.starTranDate, 'dd-MMM-yy', 'en').toLowerCase()
      : null;

    this.service
      .downloadStarReport(
        this.starTranId,
        formattedTo,
        this.starReason,
        this.starAction,
        this.starComments,
        this.selectedStarIndicators
      )
      .subscribe({
        next: (response) => {
          console.log('STAR report response:', response);
          sessionStorage.setItem('strPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'STAR report generated successfully.'
          );

          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
          const backendMessage =
            error?.error?.message ||
            error?.message ||
            'Failed to generate STAR report. Please try again.';

          this.snackbar.showNotification('snackbar-danger', backendMessage);
          this.isDownloading = false;
        },

        complete: () => {
          this.isDownloading = false;
        },
      });
  }

  downloadCtrReport() {
    this.markFormGroupTouched(this.filterForm);

    if (!this.ctrTranType || !this.ctrTranId || !this.ctrTranDate) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all required CTR fields.'
      );
      return;
    }

    this.isDownloading = true;
    const formattedTo = this.ctrTranDate
      ? formatDate(this.ctrTranDate, 'dd-MMM-yy', 'en').toLowerCase()
      : null;

    this.service
      .downloadCtrReport(this.ctrTranType, this.ctrTranId, formattedTo)
      .subscribe({
        next: (response) => {
          console.log('CTR report response:', response);
          sessionStorage.setItem('strPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'CTR report generated successfully.'
          );

          this.router.navigate(['/riskofficer/reports/reports-handling'], {
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
          const backendMessage =
            error?.error?.message ||
            error?.message ||
            'Failed to generate CTR report. Please try again';
          this.snackbar.showNotification('snackbar-danger', backendMessage);
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
