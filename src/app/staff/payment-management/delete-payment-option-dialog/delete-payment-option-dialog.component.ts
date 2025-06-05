import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-payment-option-dialog',
  templateUrl: './delete-payment-option-dialog.component.html',
})
export class DeletePaymentOptionDialogComponent {
  displayedColumns: string[] = ['select', 'name'];
  selection = new Set<any>();

  constructor(
    public dialogRef: MatDialogRef<DeletePaymentOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoryName: string; options: any[] }
  ) {}

  isAllSelected(): boolean {
    return this.selection.size === this.data.options.length;
  }

  isSomeSelected(): boolean {
    return this.selection.size > 0 && !this.isAllSelected();
  }

  toggleAllRows(event: any): void {
    if (event.checked) {
      this.data.options.forEach((option) => this.selection.add(option));
    } else {
      this.selection.clear();
    }
  }

  toggleRow(row: any): void {
    if (this.selection.has(row)) {
      this.selection.delete(row);
    } else {
      this.selection.add(row);
    }
  }

  onConfirm(): void {
    const selectedOptions = Array.from(this.selection);
    this.dialogRef.close(selectedOptions);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
