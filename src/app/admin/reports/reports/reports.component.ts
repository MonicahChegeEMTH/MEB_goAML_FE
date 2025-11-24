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
import { debounceTime, forkJoin, Subject, switchMap, tap } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { IndicatorsLookupComponent } from '../indicators-lookup/indicators-lookup.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'account_number',
    // 'reporting_user',
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
  accountList: any[] = [];
  isFetchingAccounts: boolean = false;
  identifierInput$: Subject<string> = new Subject<string>();
  filteredAccounts: any[] = [];
  fullAccountList: any[] = [];
  private lastIdNumber: string = '';
  sarInputMode: 'existing' | 'new' | null = null;
  selectedIndicatorText = '';
  selectedIndicator: any = null;
  manualSarCustomers: {
    firstName: string;
    lastName: string;
    idNumber: string;
    nationality?: string;
    occupation?: string;
    birthdate?: string;
    reason?: string;
    action?: string;
    indicators?: string[];
  }[] = [
    {
      firstName: '',
      lastName: '',
      idNumber: '',
      nationality: '',
      occupation: '',
      birthdate: '',
      reason: '',
      action: '',
      indicators: [],
    },
  ];

  openSar(mode: 'existing' | 'new') {
    this.sarInputMode = mode;
    this.showReportForm('SAR');
  }

  showReportForm(type: string) {
  this.selectedReportType = type;

  this.selectedIndicators = [];   
  this.selectedStrIndicators = [];  
  this.selectedStarIndicators = [];  
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
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchReports();

    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    this.route.queryParams.subscribe((params) => {
      const type = params['reportType'];
      const sarOption = params['sarOption'];
      if (type) {
        this.selectedReportType = type;
        if (type === 'SAR' && sarOption) {
          this.sarInputMode = sarOption;
        }
      }
    });

    this.identifierInput$
      .pipe(
        debounceTime(300),
        tap(() => (this.isFetchingAccounts = true)),
        switchMap((value) => this.fetchAccountsObservable(value)),
        tap(() => (this.isFetchingAccounts = false))
      )
      .subscribe({
        next: (data: any[]) => {
          this.accountList = data;
          this.fullAccountList = [...data];
          this.filteredAccounts = [...data];

          if (data.length === 1) {
            this.accountNumber = data[0].account_no;
          }
        },
        error: (err) => {
          console.error('Failed to fetch accounts:', err);
          this.accountList = [];
          this.fullAccountList = [];
          this.filteredAccounts = [];
          this.isFetchingAccounts = false;
        },
      });
  }

  pickIndicatorDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '50%';

    const dialogRef = this.dialog.open(IndicatorsLookupComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (!result || !result.data) return;

        const pickedCodes = result.data.map((i: any) => i.code);

         this.selectedIndicators = Array.from(
    new Set([
      ...this.selectedIndicators,
      ...pickedCodes
    ])
  );

  this.selectedStrIndicators = Array.from(
    new Set([
      ...this.selectedStrIndicators,
      ...pickedCodes
    ])
  );

  this.selectedStarIndicators = Array.from(
    new Set([
      ...this.selectedStrIndicators,
      ...pickedCodes
    ])
  );

      const indicators = result.data;

      this.selectedIndicatorText = indicators.map((i) => i.code).join(', ');

      this.selectedIndicators = indicators.map((i) => i.code);

      this.selectedStrIndicators = indicators.map((i) => i.code);

      this.selectedStarIndicators = indicators.map((i) => i.code);

      this.manualSarCustomers.forEach((c) => {
        c.indicators = indicators.map((i) => i.code);
      });
    });
  }

  onIndicatorInputChange(value: string) {
  if (!value) {
    this.selectedIndicators = [];
    return;
  }

  this.selectedIndicators = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

    this.selectedStrIndicators = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

    this.selectedStarIndicators = value
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  // Update manual SAR customers if needed
  this.manualSarCustomers.forEach(c => {
    c.indicators = [...this.selectedIndicators];
  });
}

  onIdentifierInputChange(value: string) {
    this.isFetchingAccounts = true;
    if (!value || !value.trim()) {
      this.filteredAccounts = [...this.fullAccountList];
      this.accountNumber = '';
      return;
    }

    if (this.selectedIdType === 'account') {
      this.accountNumber = value.trim();
      if (this.fullAccountList.length > 0) {
        this.filteredAccounts = [...this.fullAccountList];
      } else {
        this.identifierInput$.next('');
      }
      return;
    }

    const hasComma = value.includes(',');

    if (!hasComma) {
      if (this.fullAccountList.length > 0) {
        this.filteredAccounts = [...this.fullAccountList];
      } else {
        this.identifierInput$.next(value.trim());
      }
      return;
    }

    const parts = value.split(',');
    const searchTerm = parts[parts.length - 1].trim().toLowerCase();

    if (!searchTerm) {
      this.filteredAccounts = [...this.fullAccountList];
      return;
    }

    if (this.fullAccountList.length > 0) {
      this.filteredAccounts = this.fullAccountList.filter((acc) => {
        const combinedData = (
          acc.account_no +
          ' ' +
          acc.account_name +
          ' ' +
          acc.scheme_type
        ).toLowerCase();
        return combinedData.includes(searchTerm);
      });
    } else {
      this.identifierInput$.next(searchTerm);
    }
  }

  private hasIdNumberChanged(currentId: string): boolean {
    const hasChanged = this.lastIdNumber !== currentId;
    this.lastIdNumber = currentId;
    return hasChanged;
  }

  fetchAccountsObservable(identifier: string) {
    const docCodeMap: any = {
      nationalId: 'NATID',
      passport: 'PASSP',
      registration: 'REG1',
    };
    const docCode = docCodeMap[this.selectedIdType] || '';
    return this.service.getAccounts(docCode, identifier);
  }

  displayAccount(accountNo: string) {
    return accountNo;
  }

  onAccountSelected(account: any) {
    this.accountNumber = account.account_no;
    this.identificationNumber = account.account_no;
    this.accountList = [];

    this.isFetchingAccounts = false;
  }

  onAutocompleteClosed() {
    this.isFetchingAccounts = false;
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
    this.identificationNumber = '';
    this.filteredAccounts = [];
    this.fullAccountList = [];
    this.accountList = [];
    this.lastIdNumber = '';

    switch (type) {
      case 'passport':
        this.idPlaceholder = 'Enter passport number';
        break;
      case 'registration':
        this.idPlaceholder = 'Enter certificate of registration number';
        break;
      case 'account':
        this.idPlaceholder = 'Enter account number';
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

  fetchAccounts() {
    if (
      !this.identificationNumber ||
      !this.selectedIdType ||
      this.selectedIdType === 'account'
    ) {
      this.accountList = [];
      if (this.selectedIdType === 'account') {
        this.accountNumber = this.identificationNumber;
      }
      return;
    }

    const docCodeMap: any = {
      nationalId: 'NATID',
      passport: 'PASSP',
      registration: 'REG1',
    };

    const docCode = docCodeMap[this.selectedIdType] || '';
    this.isFetchingAccounts = true;

    this.service.getAccounts(docCode, this.identificationNumber).subscribe({
      next: (data: any[]) => {
        this.accountList = data;
        if (data.length === 1) {
          this.accountNumber = data[0].account_no;
        }
      },
      error: (err) => {
        console.error('Failed to fetch accounts:', err);
        this.accountList = [];
        this.snackbar.showNotification(
          'snackbar-danger',
          'Failed to fetch accounts'
        );
      },
    });
  }

  customFilter() {
    return (data: any, filter: string): boolean => {
      const terms = filter.trim().toLowerCase().split(/\s+/);

      const combinedData = `
      ${data.id}
      ${data.account_number}
      ${data.reporting_user}
      ${data.date}
      ${data.type}
      ${data.file_name}
    `.toLowerCase();

      return terms.every((term) => combinedData.includes(term));
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
      body: exportData.map((row: any) => [
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
    if (!this.accountNumber || this.selectedIndicators.length === 0) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all SAR fields.'
      );
      return;
    }

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

  addCustomer() {
    this.manualSarCustomers.push({
      firstName: '',
      lastName: '',
      idNumber: '',
      nationality: '',
      occupation: '',
      birthdate: '',
    });
  }

  removeCustomer(i: number) {
    if (this.manualSarCustomers.length > 1) {
      this.manualSarCustomers.splice(i, 1);
    }
  }

  downloadManualSar() {
    for (let c of this.manualSarCustomers) {
      if (!c.firstName || !c.idNumber) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Firstname, Lastname and ID Number are required for each customer.'
        );
        return;
      }
    }

    if (!this.selectedIndicators || this.selectedIndicators.length === 0) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please select at least one indicator.'
      );
      return;
    }

    this.isDownloading = true;

    const payloadArray = this.manualSarCustomers.map((c) => ({
      reason: this.sarReason,
      action: this.selectedAction,
      firstName: c.firstName,
      lastName: c.lastName,
      birthdate: c.birthdate
        ? new Date(c.birthdate).toISOString().split('T')[0]
        : '',
      occupation: c.occupation || '',
      idNumber: c.idNumber,
      nationality1: c.nationality || '',
      indicator: (c.indicators || []).join(','),
    }));

    this.service.createManualSar(payloadArray).subscribe({
      next: (response) => {
        sessionStorage.setItem('sarPreviewXML', response.xmlDocument);

        this.snackbar.showNotification(
          'snackbar-success',
          'Manual SAR report(s) generated successfully.'
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
      error: () => {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Failed to generate SAR.'
        );
        this.isDownloading = false;
      },
      complete: () => (this.isDownloading = false),
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

    const tranIds = this.strTranId
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    const tranDates = this.strTranDate
      .split(',')
      .map((date) => date.trim())
      .filter((date) => date !== '')
      .map((date) =>
        formatDate(new Date(date), 'dd-MMM-yy', 'en').toUpperCase()
      );

    this.isDownloading = true;

    this.service
      .downloadStrReport(
        tranIds,
        tranDates,
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

  addTranDate(event: any) {
    const picked = event.value;

    if (!picked) return;

    const formatted = formatDate(picked, 'dd-MMM-yy', 'en').toUpperCase();

    if (!this.strTranDate) {
      this.strTranDate = formatted;
    } else {
      const existing = this.strTranDate.split(',').map((x) => x.trim());
      if (!existing.includes(formatted)) {
        this.strTranDate += `, ${formatted}`;
      }
    }
  }

  addStarTranDate(event: any) {
    const picked = event.value;

    if (!picked) return;

    const formatted = formatDate(picked, 'dd-MMM-yy', 'en').toUpperCase();

    if (!this.starTranDate) {
      this.starTranDate = formatted;
    } else {
      const existing = this.starTranDate.split(',').map((x) => x.trim());
      if (!existing.includes(formatted)) {
        this.starTranDate += `, ${formatted}`;
      }
    }
  }

  addCtrTranDate(event: any) {
    const picked = event.value;

    if (!picked) return;

    const formatted = formatDate(picked, 'dd-MMM-yy', 'en').toUpperCase();

    if (!this.ctrTranDate) {
      this.ctrTranDate = formatted;
    } else {
      const existing = this.ctrTranDate.split(',').map((x) => x.trim());
      if (!existing.includes(formatted)) {
        this.ctrTranDate += `, ${formatted}`;
      }
    }
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

    const tranIds = this.starTranId
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    const tranDates = this.starTranDate
      .split(',')
      .map((date) => date.trim())
      .filter((date) => date !== '')
      .map((date) =>
        formatDate(new Date(date), 'dd-MMM-yy', 'en').toUpperCase()
      );

    this.isDownloading = true;

    this.service
      .downloadStarReport(
        tranIds,
        tranDates,
        this.starReason,
        this.starAction,
        this.starComments,
        this.selectedStarIndicators
      )
      .subscribe({
        next: (response) => {
          console.log('STAR report response:', response);
          sessionStorage.setItem('starPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'STAR report generated successfully.'
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

    if (!this.ctrTranId || !this.ctrTranDate) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill all required CTR fields.'
      );
      return;
    }

    const tranIds = this.ctrTranId
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    const tranDates = this.ctrTranDate
      .split(',')
      .map((date) => date.trim())
      .filter((date) => date !== '')
      .map((date) =>
        formatDate(new Date(date), 'dd-MMM-yy', 'en').toUpperCase()
      );

    this.isDownloading = true;

    this.service
      .downloadCtrReport(tranIds, tranDates)
      .subscribe({
        next: (response) => {
          console.log('CTR report response:', response);
          sessionStorage.setItem('strPreviewXML', response.xmlDocument);
          this.snackbar.showNotification(
            'snackbar-success',
            'CTR report generated successfully.'
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

  activeNewTab: string = 'customer';

manualSarCooperations: any[] = [];

addCooperation() {
  this.manualSarCooperations.push({
    firstName: '',
    lastName: '',
    idNumber: '',
    nationality: '',
    occupation: '',
    birthdate: '',
    reason: '',
    action: '',
    selectedIndicators: ''
  });
}

removeCooperation(i: number) {
  this.manualSarCooperations.splice(i, 1);
}

}
