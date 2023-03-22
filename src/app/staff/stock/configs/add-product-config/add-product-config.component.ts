import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UseraccountsComponent } from 'src/app/admin/users/useraccounts/useraccounts.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ConfigsService } from '../configs.service';
import { ProductsConfigsComponent } from '../products-configs/products-configs.component';

@Component({
  selector: 'app-add-product-config',
  templateUrl: './add-product-config.component.html',
  styleUrls: ['./add-product-config.component.sass']
})
export class AddProductConfigComponent implements OnInit {

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
      productName: ["", [Validators.required]],
      buyingPrice: ["", [Validators.required]],
      sellingPrice: ["", [Validators.required]],
      unitMeasurement: ["", [Validators.required]],
      quantity: ["", [Validators.required]],
      effectiveFrom: [""],
    });

  }


  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    this.loading = true;
    this.service.addNewConfiguration(this.configsForm.value).subscribe(
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
