import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { AccountService } from '../../data/services/account.service';
import { Account } from '../../data/types/account';
import { DeletedAccountsComponent } from '../deleted-accounts/deleted-accounts.component';

@Component({
  selector: 'app-restore-account',
  templateUrl: './restore-account.component.html',
  styleUrls: ['./restore-account.component.sass'],
})
export class RestoreAccountComponent extends BaseComponent implements OnInit {
  account: Account;
  userId: number;
  loading: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeletedAccountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit(): void {
    this.account = this.data.account;

    this.userId = this.data.account.id;
  }

  confirmRestoreAccount() {
    this.loading = true;
    this.userService
      .restoreDeletedUserAccount(this.userId)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.snackbar.showNotification('snackbar-success', res.message);

             this.userService.triggerWidgetsRefresh();

            this.dialogRef.close();
          } else {
            this.snackbar.showNotification('snackbar-danger', res.message);

            this.loading = false;
          }
        },
        (err) => {
          this.snackbar.showNotification('snackbar-danger', err.error.error);
          this.loading = false;
        }
      );
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
