import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { DeleteAccountComponent } from '../delete-account/delete-account.component';
import { LockAccountComponent } from '../lock-account/lock-account.component';
import { ModifyAccountComponent } from '../modify-account/modify-account.component';
import { RestoreAccountComponent } from '../restore-account/restore-account.component';
import { UnlockAccountComponent } from '../unlock-account/unlock-account.component';
import { UpdateAccountComponent } from '../update-account/update-account.component';
import { VerifyAccountComponent } from '../verify-account/verify-account.component';
import { AuthService } from 'src/app/core/service/auth.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'employeeNumber',
    'username',
    'firstname',
    'lastname',
    'email',
    'phonenumber',
    'role',
    'status',
    'actions',
  ];
  users: any[] = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  selection = new SelectionModel<any>(true, []);
  index: number;
  id: number;
  isLoading = true;
  tenantId: any;
  userImg: string;
  activeAccounts: number = 0;
  searchText: string = '';
  firstname: string;
  lastname: string;
  pagedUsers: any[] = [];

  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
    private tokenStorage: TokenStorageService
  ) {
    super();
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  ngOnInit(): void {
    this.getAllUsers();
    const user = this.tokenStorage.getUser();
    this.firstname = user.firstname;
    this.lastname = user.lastname;

    this.dataSource.filterPredicate = (data, filter) => {
      const f = filter.trim().toLowerCase();
      return (
        data.firstname?.toLowerCase().includes(f) ||
        data.username?.toLowerCase().includes(f) ||
        data.lastname?.toLowerCase().includes(f) ||
        data.phone?.toLowerCase().includes(f) ||
        data.employeeNumber?.toLowerCase().includes(f) ||
        data.role?.toLowerCase().includes(f)
      );
    };
  }

  clearSearch() {
    this.searchText = '';
    const event = { target: { value: '' } } as unknown as Event;
    this.applyFilter(event);
  }

  exportAsPDF(): void {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          'Employee No',
          'Username',
          'First Name',
          'Last Name',
          'Phone Number',
          'Role',
        ],
      ],
      body: this.dataSource.data.map((u) => [
        u.employeeNumber,
        u.username,
        u.firstname,
        u.lastname,
        u.phone,
        u.role,
      ]),
    });
    doc.save('users.pdf');
  }

  refresh() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.isLoading = true;
    const tenantId = localStorage.getItem('tenantId') || '000';

    this.userService
      .fetchAllUserAccounts()
      .pipe(takeUntil(this.subject))
      .subscribe({
        next: (res) => {
          console.log('Raw response from backend:', res);

          const rawUsers = res.data || [];

          this.users = rawUsers.map((u, index) => ({
            id: index + 1,
            employeeNumber: u.employeeNumber,
            firstname: u.firstname || u.firstName || '',
            username: u.username || u.userName || '',
            lastname: u.lastname || u.lastName || '',
            phone: u.phone || u.mobile || '',
            email: u.email || '',
            role: u.role || '',
            tenantId: u.tenantId || tenantId,
            status: u.status || 'Active',
          }));

          const filteredUsers = this.users.filter(
            (user) => user.tenantId === tenantId
          );

          this.dataSource = new MatTableDataSource<any>(filteredUsers);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.activeAccounts = filteredUsers.filter(
            (user) => user.status === 'Active'
          ).length;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 403) {
            this.snackbar.showNotification(
              'snackbar-danger',
              'Access Denied: Insufficient permissions to fetch users.'
            );
          } else {
            this.snackbar.showNotification(
              'snackbar-danger',
              err.error?.message || 'Failed to fetch users'
            );
          }
        },
      });
  }

  editCall(user) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.data = { user };

    const dialogRef = this.dialog.open(UpdateAccountComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
        this.userService.triggerWidgetsRefresh();
      }
    });
  }

  detailsCall(account) {
    const dialogRef = this.dialog.open(AccountDetailsComponent, {
      data: {
        account: account,
        action: 'details',
      },
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();
    });
  }

  lockAccountCall(account) {
    const dialogRef = this.dialog.open(LockAccountComponent, {
      data: {
        account: account,
        action: 'details',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
        this.userService.triggerWidgetsRefresh();
      }
    });
  }

  unLockAccountCall(account) {
    const dialogRef = this.dialog.open(UnlockAccountComponent, {
      data: {
        account: account,
        action: 'details',
      },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getAllUsers();
        this.userService.triggerWidgetsRefresh();
      }
    });
  }

  updateUser(account) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = { account };

    const dialogRef = this.dialog.open(ModifyAccountComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {
      this.getAllUsers();
    });
  }

  viewAccountLogs(userId) {
    this.router.navigate([`admin/user-accounts/account-logs/${userId}`]);
  }

  addNew() {
    this.router.navigate(['/admin/user-accounts/add-account']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { item: item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.setPagedData(startIndex, endIndex);
  }

  private setPagedData(startIndex: number, endIndex: number): void {
    this.pagedUsers = this.users.slice(startIndex, endIndex);
  }
}
