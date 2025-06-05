import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../shared/snackbar.service';
import { BankOption, PaymentManagementService } from '../services/payment-management.service';
import { MatTableExporterDirective } from 'mat-table-exporter';
import { AddPaymentOptionDialogComponent } from '../add-payment-option-dialog/add-payment-option-dialog.component';
import { DeletePaymentOptionDialogComponent } from '../delete-payment-option-dialog/delete-payment-option-dialog.component';
import { LookupPaymentOptionComponent } from '../lookup-payment-option/lookup-payment-option.component';


@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.sass']
})
export class PaymentDetailsComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  paymentOptions: BankOption[] = [];
  optionsDataSource = new MatTableDataSource<BankOption>();
  optionColumns: string[] = ['id', 'categoryName', 'name', 'active', 'createdOn', 'action'];
  selectedFilter: string = 'all';
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTableExporterDirective) exporter?: MatTableExporterDirective;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentManagementService,
    private snackbar: SnackbarService,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      code: [''],
      categoryName: ['']
    });
  }

  ngOnInit(): void {
    this.loadPaymentOptions();
    this.optionsDataSource.sort = this.sort;
    this.optionsDataSource.paginator = this.paginator;
  }

  loadPaymentOptions(): void {
    this.isLoading = true;
    const sub = this.paymentService.getPaymentOptions().subscribe({
      next: (options: BankOption[]) => {
        const groupedOptions = this.groupOptionsByCategory(options);
        this.paymentOptions = groupedOptions;
        this.optionsDataSource.data = this.paymentOptions;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching payment options:', error);
        this.isLoading = false;
        this.snackbar.showNotification('snackbar-danger', 'Failed to load payment options');
      }
    });
    this.subscriptions.push(sub);
  }

  groupOptionsByCategory(options: BankOption[]): BankOption[] {
    const categoryMap = new Map<string, BankOption>();
    options.forEach(option => {
      const category = option.categoryName.toLowerCase();
      if (categoryMap.has(category)) {
        const existing = categoryMap.get(category)!;
        const existingNames = existing.name ? existing.name.split(',').map(p => p.trim()) : [];
        const newNames = option.name ? option.name.split(',').map(p => p.trim()) : [];
        const mergedNames = [...new Set([...existingNames, ...newNames])];
        existing.name = mergedNames.join(', ');
        existing.createdOn = option.createdOn || existing.createdOn || new Date().toISOString();
        existing.active = option.active || existing.active;
        existing.code = existing.code || option.code;
      } else {
        categoryMap.set(category, { ...option, createdOn: option.createdOn || new Date().toISOString() });
      }
    });
    return Array.from(categoryMap.values());
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.optionsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.optionsDataSource.paginator) {
      this.optionsDataSource.paginator.firstPage();
    }
  }

  onFilterChange(): void {
    this.filterForm.reset();
    this.optionsDataSource.filter = '';
    if (this.optionsDataSource.paginator) {
      this.optionsDataSource.paginator.firstPage();
    }
  }

  applyFilterForm(): void {
    if (this.filterForm.valid) {
      const code = this.filterForm.get('code')?.value?.trim().toLowerCase() || '';
      const categoryName = this.filterForm.get('categoryName')?.value?.trim().toLowerCase() || '';
      this.optionsDataSource.filterPredicate = (data: BankOption, filter: string) => {
        return (
          data.code.toLowerCase().includes(code) &&
          data.categoryName.toLowerCase().includes(categoryName)
        );
      };
      this.optionsDataSource.filter = 'filter';
      if (this.optionsDataSource.paginator) {
        this.optionsDataSource.paginator.firstPage();
      }
    }
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddPaymentOptionDialogComponent, {
      width: '500px',
      data: { option: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addPaymentOption(result);
      }
    });
  }

  addPaymentOption(option: BankOption): void {
    this.isLoading = true;
    const sub = this.paymentService.addPaymentOption(option).subscribe({
      next: () => {
        this.snackbar.showNotification('snackbar-success', 'Payment option added successfully');
        this.loadPaymentOptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error adding payment option:', error);
        this.isLoading = false;
        this.snackbar.showNotification('snackbar-danger', error.message || 'Failed to add payment option');
      }
    });
    this.subscriptions.push(sub);
  }

  editOption(option: BankOption): void {
    const dialogRef = this.dialog.open(AddPaymentOptionDialogComponent, {
      width: '500px',
      data: { option }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePaymentOption(result);
      }
    });
  }

  updatePaymentOption(option: BankOption): void {
    this.isLoading = true;
    const sub = this.paymentService.updatePaymentOption(option).subscribe({
      next: () => {
        this.snackbar.showNotification('snackbar-success', 'Payment option updated successfully');
        this.loadPaymentOptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating payment option:', error);
        this.isLoading = false;
        this.snackbar.showNotification('snackbar-danger', error.message || 'Failed to update payment option');
      }
    });
    this.subscriptions.push(sub);
  }

  toggleStatus(option: BankOption): void {
    this.isLoading = true;
    const updatedOption = { ...option, active: !option.active };
    const sub = this.paymentService.updatePaymentOption(updatedOption).subscribe({
      next: () => {
        this.snackbar.showNotification('snackbar-success', `Payment option ${updatedOption.active ? 'activated' : 'deactivated'} successfully`);
        this.loadPaymentOptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error toggling payment option status:', error);
        this.isLoading = false;
        this.snackbar.showNotification('snackbar-danger', error.message || 'Failed to toggle payment option status');
      }
    });
    this.subscriptions.push(sub);
  }

//   deleteOption(option: BankOption): void {
//     const dialogRef = this.dialog.open(DeletePaymentOptionDialogComponent, {
//       width: '400px',
//       data: { id: option.id, name: option.name }
//     });
//
//     dialogRef.afterClosed().subscribe(result => {
//       if (result === true) {
//         this.isLoading = true;
//         const sub = this.paymentService.deletePaymentOption(option.id).subscribe({
//           next: () => {
//             this.snackbar.showNotification('snackbar-success', 'Payment option deleted successfully');
//             this.loadPaymentOptions();
//             this.isLoading = false;
//           },
//           error: (error) => {
//             console.error('Error deleting payment option:', error);
//             this.isLoading = false;
//             this.snackbar.showNotification('snackbar-danger', error.message || 'Failed to delete payment option');
//           }
//         });
//         this.subscriptions.push(sub);
//       }
//     });
//   }

// In your component where deleteOption() is called:
// Make sure to call this method with:
// this.deleteOption(category.id, category.name);

deleteOption(categoryId: number, categoryName: string): void {
  console.log('🔍 deleteOption called with:');
  console.log('👉 categoryId:', categoryId);
  console.log('👉 categoryName:', categoryName);
  console.log('📋 All paymentOptions:', this.paymentOptions);

  // Filter the options for the given category
  const optionsForCategory = this.paymentOptions.filter(
    option => option.categoryId === categoryId
  );

  console.log('✅ Filtered options for category:', optionsForCategory);

  const dialogRef = this.dialog.open(DeletePaymentOptionDialogComponent, {
    width: '600px',
    data: {
      categoryName,
      options: optionsForCategory
    }
  });

  dialogRef.afterClosed().subscribe((result: BankOption[] | false) => {
    if (result && result.length > 0) {
      result.forEach(option => {
        this.paymentService.deletePaymentOption(option.id).subscribe({
          next: () => {
            console.log('Deleted:', option.name);
            this.snackbar.showNotification('snackbar-success', `Deleted: ${option.name}`);
            this.loadPaymentOptions(); // Refresh the list
          },
          error: err => {
            console.error('Error deleting', option.name, err);
            this.snackbar.showNotification('snackbar-danger', err.message || 'Delete failed');
          }
        });
      });
    }
  });

}

lookupPaymentOption(data: any): void {
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = false;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '50%'; // adjust width as needed
  dialogConfig.data = { paymentOption: data };

  this.dialog.open(LookupPaymentOptionComponent, dialogConfig);
}





  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getRowId(index: number): number {
    return index + 1;
  }
}
