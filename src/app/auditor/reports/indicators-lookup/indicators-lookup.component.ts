import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReportsService } from '../service/reports.service';

@Component({
  selector: 'app-indicators-lookup',
  templateUrl: './indicators-lookup.component.html',
  styleUrls: ['./indicators-lookup.component.scss'],
})
export class IndicatorsLookupComponent implements OnInit {
  displayedColumns: string[] = ['select', 'code', 'description'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  isLoading = false;
  isData = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<IndicatorsLookupComponent>,
    private reportService: ReportsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
  this.isLoading = true;

  this.reportService.getIndicators().subscribe({
    next: (response) => {
      const formatted = response.map((item) => ({
        code: item.INDICATORCODE,
        description: item.INDICATORDESC,
      }));

      this.dataSource.data = formatted;
      this.isData = formatted.length > 0;
      this.isLoading = false;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
    error: (err) => {
      console.error('Error loading indicators:', err);
      this.isLoading = false;
    }
  });
}


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  closeWithSelection() {
    this.dialogRef.close({ data: this.selection.selected });
  }

  close() {
    this.dialogRef.close();
  }

  onSelectRow(data: any) {
    this.dialogRef.close({ data: [data] });
  }
  toggleRow(row: any) {
    this.selection.toggle(row);
  }
}
