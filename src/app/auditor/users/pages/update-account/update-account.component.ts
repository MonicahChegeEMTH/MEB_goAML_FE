import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ActiveAccountsComponent } from '../active-accounts/active-accounts.component';

@Component({
  selector: 'app-update-account',
  templateUrl: './update-account.component.html',
  styleUrls: ['./update-account.component.sass'],
})
export class UpdateAccountComponent extends BaseComponent implements OnInit {
  user: any;
  userId: any;
  loading: boolean;
  accountForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ActiveAccountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private userService: UserService,
    private snackbar: SnackbarService,
    private router: Router
  ) {
    super();

    this.user = data.user;
    this.userId = this.user.id;
  }

  ngOnInit(): void {
    this.updateAccountForm();
  }

  updateAccountForm() {
    this.accountForm = this.fb.group({
      username: [this.user.username || '', [Validators.required]],
      firstName: [this.user.firstName || '', [Validators.required]],
      lastName: [this.user.lastName || '', [Validators.required]],
      email: [this.user.email || '', [Validators.email]],
      role: [
        this.user.roles && this.user.roles[0] ? this.user.roles[0].name : '',
        [],
      ],
      mobile: [this.user.mobile || '', [Validators.required]],
    });
  }

  roleLookup() {
    // Implement role lookup logic here
  }

  updateAccount() {
    this.loading = true;

    this.userService
      .updateUser(this.userId, this.accountForm.value)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          if (res.statusCode == 200 || res.statusCode == 201) {
            this.snackbar.showNotification(res.message, 'snackbar-success');
            this.dialogRef.close();
          } else {
            this.snackbar.showNotification(res.message, 'snackbar-danger');
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          this.snackbar.showNotification(err.error.error, 'snackbar-danger');
          this.loading = false;
        }
      );
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
