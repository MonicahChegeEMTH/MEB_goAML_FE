import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SystemrolesComponent } from '../systemroles/systemroles.component';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.sass']
})
export class ViewRoleComponent implements OnInit {

  addRoleForm: FormGroup;
  loading = false;
  dialogData: any;

  displayedColumns: string[] = ["privilege"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<SystemrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
    this.addRoleForm = this.fb.group({
      name: [this.data.roles.name],
    });
    this.dataSource = new MatTableDataSource(this.data.roles.accessRights);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  onClick() {
    this.dialogRef.close();
  }
}

