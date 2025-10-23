import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../data/services/account.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.sass'],
})
export class VerifyAccountComponent implements OnInit {
  Data: any;

  statusForm: FormGroup;
  statusTypes: string[] = ['Approve', 'Reject'];
  rejected: boolean = false;
  currentUser: any;
  postedBy: any;
  canVerify: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<VerifyAccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private accountService: AccountService,
    private snackbar: SnackbarService
  ) {}
  ngOnInit(): void {
    this.Data = this.data.account;

    this.postedBy = this.Data.modifiedBy;

    if (this.postedBy === this.currentUser) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'You cannot verify an account you created !'
      );
      this.canVerify = false;
    } else {
      this.canVerify = true;
    }

    this.statusForm = this.createStatusForm();
  }

  createStatusForm(): FormGroup {
    return this.fb.group({
      action: ['', [Validators.required]],
      remarks: [''],
    });
  }

  changeStatus() {
    const params = new HttpParams()
      .set('action', this.statusForm.value.action)
      .set('verifierStatus', this.statusForm.value.action)
      .set('verifierRemarks', this.statusForm.value.remarks);

    this.accountService.verifyAccount(params).subscribe(
      (res) => {
        this.dialogRef.close();
        this.snackbar.showNotification(
          'snackbar-success',
          'Account verified succesfully!'
        );
      },
      (err) => {
        console.error('Verification error: ', err);

        const message =
          err?.error?.message ||
          err?.message ||
          "You don't have sufficient privileges to perform this action!";

        this.snackbar.showNotification('snackbar-danger', message);
      }
    );
  }

  onCancel() {
    this.dialogRef.close();
  }
}
