import { Component, OnInit, ViewChild } from '@angular/core';
import { AuditLog } from '../service/audit-log.model';
import { AuditLogService } from '../service/audit-log.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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

  constructor(private auditLogService: AuditLogService) {}

  ngOnInit(): void {
    this.fetchAuditLogs();
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
}
