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
  id: any;
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
    this.id = this.user.id;
  }

  ngOnInit(): void {
    this.updateAccountForm();
  }

  updateAccountForm() {
    this.accountForm = this.fb.group({
      employeeNumber: [this.user.employeeNumber || '', [Validators.required]],
      username: [this.user.username || '', [Validators.required]],
      firstname: [this.user.firstname || '', [Validators.required]],
      lastname: [this.user.lastname || '', [Validators.required]],
      email: [this.user.email || '', [Validators.email, Validators.required]],
      role: [
        this.user.roles && this.user.roles[0] ? this.user.roles[0].name : '',
        [],
      ],
      phone: [this.user.phone || '', [Validators.required]],
    });
  }

  roleLookup() {}

  updateAccount() {
    this.loading = true;

    const payload = {
      id: this.id,
      firstname: this.accountForm.value.firstname,
      lastname: this.accountForm.value.lastname,
      phone: this.accountForm.value.phone,
      email: this.accountForm.value.email,
      employeeNumber: this.accountForm.value.employeeNumber,
      username: this.accountForm.value.username,
      role: this.accountForm.value.role || this.user.role || 'ROLE_ADMIN',
      status: this.user.status || 'ACTIVE',
    };

    this.userService
      .updateUser(this.id, payload)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          this.snackbar.showNotification(
            'snackbar-success',
            'User updated successfully!'
          );
          this.dialogRef.close(true);
        },
        (err: HttpErrorResponse) => {
          this.snackbar.showNotification('snackbar-danger', err.error.error);
          this.loading = false;
        }
      );
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
