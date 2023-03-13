import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { UseraccountsComponent } from '../useraccounts/useraccounts.component';

@Component({
  selector: 'app-restoreaccount',
  templateUrl: './restoreaccount.component.html',
  styleUrls: ['./restoreaccount.component.sass']
})
export class RestoreaccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<UseraccountsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: SnackbarService,
    private service: AuthService) { }

  name: any;
  subscription!: Subscription;
  loading = false;

  ngOnInit(): void {
    this.name = this.data.user.username;

  }

  onRestore() {
    this.loading == true;
    this.subscription = this.service.restoreAccount(this.data.user.username).subscribe(res => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
      this.dialogRef.close();
    }, err => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", err);
      this.dialogRef.close();
    })
  }

  onClick() {
    this.dialogRef.close();
  }
}
