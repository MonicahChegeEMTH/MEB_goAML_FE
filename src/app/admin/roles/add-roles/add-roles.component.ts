import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { RolesService } from '../roles.service';
import { SystemrolesComponent } from '../systemroles/systemroles.component';

@Component({
  selector: 'app-add-roles',
  templateUrl: './add-roles.component.html',
  styleUrls: ['./add-roles.component.sass']
})
export class AddRolesComponent implements OnInit {
  addRoleForm: FormGroup;
  loading = false;

  constructor( public dialogRef: MatDialogRef<SystemrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service:RolesService) {}
    subscription!: Subscription;


  ngOnInit(): void {
    this.addRoleForm = this.fb.group({
      name: ["", [Validators.required]],
    })
  }

  onSubmit() {
    this.loading = true;
    this.subscription = this.service.addNewRole(this.addRoleForm.value).subscribe(res => {
      this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
      this.loading = false;
      this.addRoleForm.reset();
      this.dialogRef.close();
    }, err => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", err);
      this.dialogRef.close();
    })
  }

  onClick(){
    this.dialogRef.close();
  }

}
