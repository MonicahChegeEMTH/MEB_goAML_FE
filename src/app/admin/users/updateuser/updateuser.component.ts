import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { LookupuserComponent } from '../lookupuser/lookupuser.component';
import { UseraccountsComponent } from '../useraccounts/useraccounts.component';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.sass']
})
export class UpdateuserComponent implements OnInit {

  userForm: FormGroup;
  roles: any;
  departments: any;
  senior: any;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AuthService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<UseraccountsComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.userForm = this.updateAccountForm();
   }


  updateAccountForm(): FormGroup {
    return this.fb.group({
      firstname: [this.data.user.firstname, [Validators.required]],
      lastname: [this.data.user.lastname, [Validators.required]],
      username: [this.data.user.username, [Validators.required]],
      phonenumber: [this.data.user.phonenumber, [Validators.required]],
      email: [this.data.user.email, [Validators.required]],
      reportingTo: [this.data.user.reportingTo, [Validators.required]],
      id: [this.data.user.id, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }

  updateUser() {
    this.loading = true;
    this.accountService.updateUser({
      firstname: this.userForm.value.firstname,
      lastname: this.userForm.value.lastname,
      username: this.userForm.value.username,
      phonenumber: this.userForm.value.phonenumber,
      email: this.userForm.value.email,
      id:this.userForm.value.id,
      reportingTo: this.userForm.value.reportingTo,
    }).subscribe(
      (res) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
        this.userForm.reset();
        this.dialogRef.close();
      },
      (err) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "1000px";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(LookupuserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.senior = result;
      this.userForm.patchValue({
        reportingTo: this.senior,
      });
    });
  }

}
