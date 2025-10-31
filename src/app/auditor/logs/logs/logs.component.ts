import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuditLog } from '../service/audit-log.model';
import { AuditLogService } from '../service/audit-log.service';
import { MatPaginator } from '@angular/material/paginator';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'user_id',
    'username',
    'action_type',
    'report_type',
    'records_retrieved',
    'createdat',
    'ip_address',
    'file',
  ];

  dataSource = new MatTableDataSource<AuditLog>([]);
  isLoading = true;
  errorMessage = '';
  firstname: string;
  lastname: string;
  searchText = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private auditLogService: AuditLogService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.fetchAuditLogs();
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchAuditLogs(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.isLoading = false;
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

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Audit Logs', 14, 15);

    autoTable(doc, {
      head: [
        [
          'User Id',
          'Username',
          'Action Type',
          'Report Type',
          'Records Retrieved',
          'Timestamp',
          'IP Address',
        ],
      ],
      body: this.dataSource.data.map((row: any) => [
        row.user_id,
        row.username,
        row.action_type,
        row.report_type,
        row.records_retrieved,
        row.created_at ? new Date(row.created_at).toLocaleString() : '',
        row.ip_address,
      ]),
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] },
    });

    doc.save('logs-records.pdf');
  }
}
