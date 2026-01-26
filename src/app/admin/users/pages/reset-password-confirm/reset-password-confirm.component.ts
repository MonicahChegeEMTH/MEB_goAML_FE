import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
})
export class ResetPasswordConfirmComponent {
  constructor(
    public dialogRef: MatDialogRef<ResetPasswordConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { username: string }
  ) {}

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
