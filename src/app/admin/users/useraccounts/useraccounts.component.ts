import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { AdduserComponent } from '../adduser/adduser.component';
import { DeleteaccountComponent } from '../deleteaccount/deleteaccount.component';
import { LockaccountComponent } from '../lockaccount/lockaccount.component';
import { Account } from '../models/account';
import { RestoreaccountComponent } from '../restoreaccount/restoreaccount.component';
import { UnlockaccountComponent } from '../unlockaccount/unlockaccount.component';
import { UpdatedepartmentComponent } from '../updatedepartment/updatedepartment.component';
import { UpdatepasswordComponent } from '../updatepassword/updatepassword.component';
import { UpdateuserComponent } from '../updateuser/updateuser.component';
import { ViewuserComponent } from '../viewuser/viewuser.component';

@Component({
  selector: 'app-useraccounts',
  templateUrl: './useraccounts.component.html',
  styleUrls: ['./useraccounts.component.scss']
})
export class UseraccountsComponent implements OnInit {

  displayedColumns: string[] = [
    "id",
    "email",
    "name",
    "username",
    "role",
    "actions",
  ];

  selected = 'all';
  users: Account[] = [];
  dataSource!: MatTableDataSource<Account>;
  selection = new SelectionModel<Account>(true, []);
  index: number;
  id: number;
  isLoading = true;
  isdata:boolean;

  constructor(
    private accountService: AuthService,
    public dialog: MatDialog,
    private snackbar: SnackbarService,
    private router: Router
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

  fetchData() {
    if (this.selected == "all") {
      this.getAllUsers();
    }
    else if (this.selected == "active") {
      this.getActiveUserAccounts();
    }
    else if (this.selected == "locked") {
      this.getLockedAccounts();
    }
    else if (this.selected == "deleted") {
      this.getDeletedAccounts();
    }
  }

  getAllUsers() {
    this.accountService.allUsers()
      .subscribe(
        (res) => {
          this.users = res;
          if (this.users.length > 0) {
            this.isLoading = false;
            this.isdata = true;
            this.dataSource = new MatTableDataSource<Account>(this.users);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.isdata = false;
            this.dataSource = new MatTableDataSource<Account>(this.users);
          }
        }
      );
  }


  getActiveUserAccounts() {
    this.isdata = false;
    this.accountService.allActiveUsers().subscribe(
      (res) => {
        this.users = res;
        if (this.users.length > 0) {
          this.isLoading = false;
          this.isdata = true;
          this.dataSource = new MatTableDataSource<Account>(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.isdata = false;
          this.dataSource = new MatTableDataSource<Account>(this.users);
        }
      },
      (err) => {
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }

  getLockedAccounts() {
    this.isdata = false;
    this.accountService.allLockedUserAccounts().subscribe(
      (res) => {
        this.users = res;
        if (this.users.length > 0) {
          this.isLoading = false;
          this.isdata = true;
          this.dataSource = new MatTableDataSource<Account>(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.isdata = false;
          this.dataSource = new MatTableDataSource<Account>(this.users);
        }
      },
      (err) => {
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }

  getDeletedAccounts() {
    this.isdata = false;
    this.accountService.allDeletedUserAccounts().subscribe(
      (res) => {
        this.users = res;
        if (this.users.length > 0) {
          this.isLoading = false;
          this.isdata = true;
          this.dataSource = new MatTableDataSource<Account>(this.users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.isdata = false;
          this.dataSource = new MatTableDataSource<Account>(this.users);
        }
      },
      (err) => {
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }



  editCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "800px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(UpdateuserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }


  changePasswordCall(username) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data = {
      username,
    };
    const dialogRef = this.dialog.open(UpdatepasswordComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }


  changeDepartmentCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "500px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(UpdatedepartmentComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }

  accountDetailsCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "1000px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(ViewuserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }

  deleteDetailsCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(DeleteaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }

  lockAccountCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(LockaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }


  restoreAccountCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(RestoreaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }


  unLockAccountCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "450px";
    dialogConfig.data = {
      user,
    };
    const dialogRef = this.dialog.open(UnlockaccountComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.getAllUsers();
    });
  }


  addNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "1000px"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(AdduserComponent, dialogConfig)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // context menu
  onContextMenu(event: MouseEvent, item: Account) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem("mouse");
    this.contextMenu.openMenu();
  }
}