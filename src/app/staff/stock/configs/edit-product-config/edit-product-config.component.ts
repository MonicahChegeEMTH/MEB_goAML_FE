import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UseraccountsComponent } from 'src/app/admin/users/useraccounts/useraccounts.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { ConfigsService } from '../configs.service';
import { ProductsConfigsComponent } from '../products-configs/products-configs.component';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-edit-product-config',
  templateUrl: './edit-product-config.component.html',
  styleUrls: ['./edit-product-config.component.sass']
})
export class EditProductConfigComponent extends BaseComponent implements OnInit {

  configsForm: FormGroup;
  loading = false;
  routes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ConfigsService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<ProductsConfigsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super()
   }

  ngOnInit(): void {
    this.configsForm = this.fb.group({
      id: [this.data.configs.id, [Validators.required]],
      productName: [this.data.configs.productName, [Validators.required]],
      buyingPrice: [this.data.configs.buyingPrice, [Validators.required]],
      sellingPrice: [this.data.configs.sellingPrice, [Validators.required]],
      unitMeasurement: [this.data.configs.unitMeasurement, [Validators.required]],
      quantity: [this.data.configs.quantity, [Validators.required]],
      effectiveFrom: [this.data.configs.effectiveFrom, [Validators.required]],
      routeFk: [this.data.configs.routeFk, [Validators.required]]
    });

    this.getRoutes();

  }

  getRoutes(){
    this.service.getRoutes().pipe(takeUntil(this.subject)).subscribe(res => {
      let routes = res.entity;

      if(routes.length > 0){
        this.routes = routes;
      }
    }, err => {
      console.log(err)
    })
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

