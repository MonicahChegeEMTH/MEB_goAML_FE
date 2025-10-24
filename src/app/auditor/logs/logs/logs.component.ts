import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { AuditLog } from '../service/audit-log.model';
import { AuditLogService } from '../service/audit-log.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  reports: AuditLog[] = [];
  pagedReports: AuditLog[] = [];
  isLoading = true;
  errorMessage = '';
  firstname: string;
  lastname: string;
  searchText: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'user_id',
    'username',
    'action_type',
    'report_type',
    'records_retrieved',
    'ip_address',
    'file',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private auditLogService: AuditLogService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.fetchAuditLogs();
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

     this.dataSource.filterPredicate = (data, filter) => {
      const f = filter.trim().toLowerCase();
      return (
        data.user_id?.toLowerCase().includes(f) ||
        data.username?.toLowerCase().includes(f) ||
        data.action_type?.toLowerCase().includes(f) ||
        data.report_type?.toLowerCase().includes(f)
      );
    };
  }

  fetchAuditLogs(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (data) => {
        this.reports = data;
        this.isLoading = false;
        this.setPagedData(0, 5);
      },
      error: (err) => {
        console.error('Error fetching audit logs', err);
        this.errorMessage = 'Failed to load audit logs. Please try again.';
        this.isLoading = false;
      },
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
}
