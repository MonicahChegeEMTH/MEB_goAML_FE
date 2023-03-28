import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UseraccountsComponent } from 'src/app/admin/users/useraccounts/useraccounts.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ConfigsService } from '../configs.service';
import { ProductsConfigsComponent } from '../products-configs/products-configs.component';

@Component({
  selector: 'app-edit-product-config',
  templateUrl: './edit-product-config.component.html',
  styleUrls: ['./edit-product-config.component.sass']
})
export class EditProductConfigComponent implements OnInit {

  configsForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: ConfigsService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<ProductsConfigsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.configsForm = this.fb.group({
      id: [this.data.configs.id, [Validators.required]],
      productName: [this.data.configs.productName, [Validators.required]],
      buyingPrice: [this.data.configs.buyingPrice, [Validators.required]],
      sellingPrice: [this.data.configs.sellingPrice, [Validators.required]],
      unitMeasurement: [this.data.configs.unitMeasurement, [Validators.required]],
      quantity: [this.data.configs.quantity, [Validators.required]],
      effectiveFrom: [this.data.configs.effectiveFrom, [Validators.required]],
    });

  }


  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading = true;
    this.service.updateConfiguration(this.configsForm.value).subscribe(
      (res) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-success", "Successful!");
        this.configsForm.reset();
        this.dialogRef.close();
      },
      (err) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }
}
