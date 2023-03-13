import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { Account } from '../models/account';

@Component({
  selector: 'app-uploadedusers',
  templateUrl: './uploadedusers.component.html',
  styleUrls: ['./uploadedusers.component.scss']
})
export class UploadedusersComponent implements OnInit {

  displayedColumns: string[] = [
    "id",
    "username",
    "name",
    "department",
    "email",
    "phonenumber",
    "reportingTo",
  ];

  users: Account[] = [];
  dataSource!: MatTableDataSource<Account>;
  selection = new SelectionModel<Account>(true, []);
  index: number;
  id: number;
  isLoading = true;
  loading = false;

  constructor(
    private accountService: AuthService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
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

  getAllUsers() {
    this.accountService.bulkUsers()
      .subscribe(
        (res) => {
          this.users = res.entity;
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

  addNew() {
    this.loading = true;
    this.accountService.initiateBulkRegistration()
      .subscribe(
        (res) => {
          this.snackbar.showNotification(
            "snackbar-success", "SUCCESSFUL!"
          );
          this.loading = false;
          this.router.navigate(['/admin/users'])
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification("snackbar-danger", err);
        }
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
