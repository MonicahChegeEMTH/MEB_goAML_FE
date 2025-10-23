import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { AccountService } from '../../data/services/account.service';
import { Account } from '../../data/types/account';
import { ActiveAccountsComponent } from '../active-accounts/active-accounts.component';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.sass'],
})
export class DeleteAccountComponent extends BaseComponent implements OnInit {
  account: any;
  userId: number;
  loading: boolean;
  reason: string = '';

  constructor(
    public dialogRef: MatDialogRef<ActiveAccountsComponent>,
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

  confirmDelete() {
    this.loading = true;

    this.userService
      .deleteUserAccount(this.userId, this.reason)
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}
