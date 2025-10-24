import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Account } from '../../data/types/account';

@Component({
  selector: 'app-user-widgets',
  templateUrl: './user-widgets.component.html',
  styleUrls: ['./user-widgets.component.scss'],
})
export class UserWidgetsComponent extends BaseComponent implements OnInit {
  activeAccounts: number = 0;
  totalAccounts: number = 0;
  lockedAccounts: number = 0;

  allTenantUsers: Account[] = [];

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.getAllUserAccountsForWidgets();

    // Refresh widget data when triggered from another component
    this.userService.refreshWidgets$
      .pipe(takeUntil(this.subject))
      .subscribe(() => {
        this.getAllUserAccountsForWidgets();
      });
  }

  getAllUserAccountsForWidgets() {
    this.userService
      .fetchAllUserAccounts()
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          // ✅ Use the backend-provided totals directly
          this.totalAccounts = res?.totalUsers || 0;
          this.activeAccounts = res?.totalActive || 0;
          this.lockedAccounts = res?.totalLocked || 0;

          // ✅ Keep full data if you still need it
          this.allTenantUsers = res?.data || [];
        },
        (err) => {
          console.error('Failed to fetch users for widgets', err);
          this.activeAccounts = this.lockedAccounts = this.totalAccounts = 0;
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
