import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { AdduserComponent } from '../adduser/adduser.component';
import { Account } from '../models/account';

@Component({
  selector: 'app-lookupuser',
  templateUrl: './lookupuser.component.html',
  styleUrls: ['./lookupuser.component.scss']
})
export class LookupuserComponent implements OnInit {

  displayedColumns: string[] = [
    "id",
    "name",
    "department",
    "phonenumber",
    "actions",
  ];
  users: Account[] = [];
  dataSource!: MatTableDataSource<Account>;
  selection = new SelectionModel<Account>(true, []);
  index: number;
  id: number;
  isLoading = true;

  constructor(
    private accountService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<AdduserComponent>
  ) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit(): void {
    this.getAllUsers();
  }

  refresh() {
    this.getAllUsers();
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  close()
  {
    this.dialogRef.close();
  }

  getAllUsers() {
    this.accountService.allUsers()
      .subscribe(
        (res) => {
          this.users = res;
          if (this.users) {
            this.isLoading = false;
          }

          this.dataSource = new MatTableDataSource<Account>(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err) => {
          console.log(err);
        }
      );
  }


}
