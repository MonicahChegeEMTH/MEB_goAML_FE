import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { UseraccountsComponent } from '../useraccounts/useraccounts.component';

@Component({
  selector: 'app-updatedepartment',
  templateUrl: './updatedepartment.component.html',
  styleUrls: ['./updatedepartment.component.sass']
})
export class UpdatedepartmentComponent implements OnInit {

  updateDepartmentForm: FormGroup;
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
    this.updateDepartmentForm = this.updateUserDepartmentForm();
  }

  updateUserDepartmentForm(): FormGroup {
    return this.fb.group({
      department: [this.data.user.department, [Validators.required]],
      username: [this.data.user.username, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  name: any;
  id:any;

  pickDepartmentDialog(): void {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "50%";
    // dialogConfig.data = {
    //   user: '',
    // };
    // const dialogRef = this.dialog.open(LookupdepartmentsComponent, dialogConfig);
    // dialogRef.afterClosed().subscribe((result) => {
    //   this.departments = result;

    //   this.name = this.departments.departmentName;
    //   this.id = this.departments.id;
    //   this.updateDepartmentForm.patchValue({
    //     department: this.name,
    //   });
    // });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading = true;
    this.updateDepartmentForm.value.department = this.id;
    this.accountService.updateUserDepartment({
      department: this.updateDepartmentForm.value.department,
      username: this.updateDepartmentForm.value.username,
    }).subscribe(
      (res) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
        this.updateDepartmentForm.reset();
        this.dialogRef.close();
      },
      (err) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );

  }


}
