import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { UseraccountsComponent } from '../useraccounts/useraccounts.component';

@Component({
  selector: 'app-viewuser',
  templateUrl: './viewuser.component.html',
  styleUrls: ['./viewuser.component.sass']
})
export class ViewuserComponent implements OnInit {

  userForm: FormGroup;
  roles: any;
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
    this.userForm = this.userDetailsForm();
   }

   userDetailsForm(): FormGroup {
    return this.fb.group({
      firstname: [this.data.user.firstname, [Validators.required]],
      lastname: [this.data.user.lastname, [Validators.required]],
      username: [this.data.user.username, [Validators.required]],
      phonenumber: [this.data.user.phonenumber, [Validators.required]],
      email: [this.data.user.email, [Validators.required]],
      reportingTo: [this.data.user.reportingTo, [Validators.required]],
      id: [this.data.user.id, [Validators.required]],
      department: [this.data.user.department, [Validators.required]],
      role: [this.data.user.roles[0].name, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  onCancel() {
    this.dialogRef.close();
  }
}
