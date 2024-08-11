import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.sass']
})
export class ManageComponent implements OnInit {
  dataSource: any
  displayedColumns = ['id', 'route', 'transporter', 'status', 'addedon', 'actions']

  constructor() { }

  ngOnInit(): void {
  }

  applyFilter(event: any) {}

  refresh() {}
  create() {}

}
