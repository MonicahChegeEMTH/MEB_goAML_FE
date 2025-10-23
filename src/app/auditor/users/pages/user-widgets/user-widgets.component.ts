import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Account } from '../../data/types/account';

@Component({
  selector: 'app-user-widgets',
  templateUrl: './user-widgets.component.html',
  styleUrls: ['./user-widgets.component.sass'],
})
export class UserWidgetsComponent extends BaseComponent implements OnInit {
  activeAccounts: number = 0;
  totalAccounts: number = 0;
  lockedAccounts: number = 0;

  activeAccountsArray: Account[] = [];
  lockedAccountsArray: Account[] = [];
  allTenantUsers: Account[] = [];

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getAllUserAccountsForWidgets();

    this.userService.refreshWidgets$
    .pipe(takeUntil(this.subject))
    .subscribe(() => {
      this.getAllUserAccountsForWidgets();
    });
  }

  getAllUserAccountsForWidgets() {
    const tenantId = localStorage.getItem('tenantId') || '000';

    this.userService
      .fetchAllUserAccounts()
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          const allUsers = res?.userData || [];

          // 🔹 Filter by tenantId
          this.allTenantUsers = allUsers.filter((u) => u.tenantId === tenantId);

          // 🔹 Split into categories
          this.activeAccountsArray = this.allTenantUsers.filter(
            (u) => u.status === 'Active'
          );
          this.lockedAccountsArray = this.allTenantUsers.filter(
            (u) => u.status === 'Locked'
          );

          // 🔹 Counts
          this.activeAccounts = this.activeAccountsArray.length;
          this.lockedAccounts = this.lockedAccountsArray.length;
          this.totalAccounts = this.allTenantUsers.length;
        },
        (err) => {
          console.error('Failed to fetch users for widgets', err);
          this.activeAccounts =
            this.lockedAccounts =
            this.totalAccounts =
              0;
        }
      );
  }

  // 🔹 Navigation actions
  viewActivateUserAccounts() {
    this.router.navigate(['/admin/user-accounts/active-accounts']);
  }

  viewInactiveUserAccounts() {
    this.router.navigate(['/admin/user-accounts/all']);
  }

  viewLockedAccounts() {
    this.router.navigate(['/admin/user-accounts/locked-accounts']);
  }
}
