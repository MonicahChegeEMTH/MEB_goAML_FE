import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PaymentManagementService, PaymentMode, BankOption } from '../services/payment-management.service';

@Component({
  selector: 'app-add-payment-option-dialog',
  templateUrl: './add-payment-option-dialog.component.html',
  styleUrls: ['./add-payment-option-dialog.component.sass']
})
export class AddPaymentOptionDialogComponent implements OnInit, OnDestroy {
  addPaymentForm: FormGroup;
  categories: PaymentMode[] = [];
  categoryExamples: { [key: string]: string } = {};
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddPaymentOptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { option?: BankOption },
    private fb: FormBuilder,
    private paymentService: PaymentManagementService
  ) {
    this.addPaymentForm = this.fb.group({
      name: [data.option?.name || '', [Validators.required, Validators.maxLength(100)]],
      categoryName: [data.option?.categoryName || '', [Validators.required]],
      active: [data.option ? data.option.active : true]
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    const modeSub = this.paymentService.getPaymentModes().subscribe({
      next: (modes: PaymentMode[]) => {
        this.categories = modes;
        this.paymentService.getPaymentOptions().subscribe({
          next: (options: BankOption[]) => {
            modes.forEach(mode => {
              const modeOptions = options
                .filter(opt => opt.categoryName === mode.name)
                .map(opt => opt.name)
                .slice(0, 2)
                .join(', ');
              this.categoryExamples[mode.name] = modeOptions || this.getDefaultExample(mode.name);
            });
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching payment options:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching payment modes:', error);
        this.isLoading = false;
      }
    });
    this.subscriptions.push(modeSub);
  }

  getDefaultExample(category: string): string {
    switch (category.toUpperCase()) {
      case 'BANK': return 'Equity Bank, KCB Bank';
      case 'MOBILE MONEY': return 'Airtel Money, Telkom';
      case 'CASH': return 'Cash Payment, Petty Cash';
      case 'COOPERATIVE SACCOS': return 'Mwalimu SACCO, Stima SACCO';
      case 'ATM': return 'Visa ATM, Mastercard ATM';
      case 'AUTOMATIC': return 'Auto Debit, Direct Transfer';
      default: return '';
    }
  }

  onSubmit(): void {
    if (this.addPaymentForm.valid) {
      this.isLoading = true;
      const formValue = this.addPaymentForm.getRawValue();
      const selectedCategory = this.categories.find(c => c.name === formValue.categoryName);
      const option: Partial<BankOption> = {
        name: formValue.name.trim(),
        categoryId: selectedCategory?.id,
        active: formValue.active,
        createdOn: this.data.option?.createdOn || new Date().toISOString()
      };

      if (this.data.option) {
        option.id = this.data.option.id;
        option.categoryName = formValue.categoryName;
      }

      const action = this.data.option
        ? this.paymentService.updatePaymentOption(option as BankOption)
        : this.paymentService.addPaymentOption(option as BankOption);

      const sub = action.subscribe({
        next: () => {
          this.isLoading = false;
          this.dialogRef.close(option);
        },
        error: (error) => {
          console.error('Error saving payment option:', error);
          this.isLoading = false;
        }
      });
      this.subscriptions.push(sub);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
