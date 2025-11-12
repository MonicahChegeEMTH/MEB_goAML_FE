import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AuditLog } from '../service/audit-log.model';
import { AuditLogService } from '../service/audit-log.service';
import { MatPaginator } from '@angular/material/paginator';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',

    'username',
    'action_type',
    'report_type',

    'createdat',
    'ip_address',
  ];

  dataSource = new MatTableDataSource<AuditLog>([]);
  isLoading = true;
  errorMessage = '';
  firstname: string;
  lastname: string;
  searchText = '';
  today = new Date();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('exporter', { static: false }) exporter: any;

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

  fetchAuditLogs(): void {
    this.auditLogService.getAuditLogs().subscribe({
      next: (data) => {
        this.dataSource.data = data.map((log: any) => ({
          ...log,
          created_at: formatDate(
            log.created_at,
            'MMM d, y, h:mm:ss a',
            'en-US'
          ),
        }));
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = this.customFilter();
  }

  customFilter() {
    return (data: AuditLog, filter: string): boolean => {
      const terms = filter.trim().toLowerCase().split(/\s+/);

      const combinedData = `
      ${data.id}
      ${data.user_id}
      ${data.username}
      ${data.action_type}
      ${data.report_type}
      ${data.created_at}
      ${data.ip_address}
    `.toLowerCase();

      return terms.every((term) => combinedData.includes(term));
    };
  }

  applyFilter(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  clearSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  getCurrentDateString(): string {
    return formatDate(new Date(), 'yyyyMMdd', 'en-US');
  }

  downloadPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Audit Logs', 14, 15);

    const exportData =
      this.dataSource.filteredData.length > 0
        ? this.dataSource.filteredData
        : this.dataSource.data;

    autoTable(doc, {
      head: [
        [
          'User Id',
          'Username',
          'Action Type',
          'Activity',
          'Timestamp',
          'IP Address',
        ],
      ],
      body: exportData.map((row) => [
        row.user_id,
        row.username,
        row.action_type,
        row.report_type,
        row.created_at,
        row.ip_address,
      ]),
      startY: 25,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] },
    });

    const fileName = `Auditlogs_${this.getCurrentDateString()}.pdf`;
    doc.save(fileName);
  }

  exportXlsx(): void {
    if (!this.exporter) {
      console.error('Exporter not found!');
      return;
    }
    const fileName = `Auditlogs_${this.getCurrentDateString()}`;
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
}
