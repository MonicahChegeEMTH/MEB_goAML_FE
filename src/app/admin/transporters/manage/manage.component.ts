import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit {
  dataSource: any
  displayedColumns = ['id', 'route', 'transporter', 'status', 'addedon', 'actions']
  loading: boolean = false

  @ViewChild(MatPaginator, {static: true}) paginator : MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.dataSource.filter = value.trim().toLowerCase()
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  refresh() {}
  create() {}
  get() {}
  edit(user: any) {}

}
