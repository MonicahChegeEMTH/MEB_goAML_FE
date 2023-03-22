import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerService } from '../../services/farmer.service';
import { FarmerManagenentComponent } from '../farmer-managenent/farmer-managenent.component';

@Component({
  selector: 'app-update-farmer',
  templateUrl: './update-farmer.component.html',
  styleUrls: ['./update-farmer.component.sass']
})
export class UpdateFarmerComponent implements OnInit {

  farmerRegirstartionForm: FormGroup;
  loading = false;
  isLoading: Boolean
  isdata: Boolean
  subcounties: any[] = []
  wards: any;

  constructor(public dialogRef: MatDialogRef<FarmerManagenentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: FarmerService) { }
  subscription!: Subscription;


  ngOnInit(): void {
    this.farmerRegirstartionForm = this.fb.group({
      username: [this.data.farmer.username, [Validators.required]],
      firstName: [this.data.farmer.firstName, [Validators.required]],
      lastName: [this.data.farmer.lastName, [Validators.required]],
      bankAccountNo: [this.data.farmer.bankAccountNo, [Validators.required]],
      idNumber: [this.data.farmer.idNumber, [Validators.required]],
      mobileNo: [this.data.farmer.mobileNo, [Validators.required]],
      address: [this.data.farmer.address, [Validators.required]],
      subcounty_fk: [this.data.farmer.address.subcounty_fk],
      wardFk: [this.data.farmer.address.wardFk],
      memberType: [this.data.farmer.memberType, [Validators.required]],
      alternativeMobileNo: [this.data.farmer.alternativeMobileNo, [Validators.required]],
      noOfCows: [this.data.farmer.noOfCows, [Validators.required]],
      id: [this.data.farmer.id],
    })

    this.getSubcounties();
  }

  onSubmit() {
    this.loading = true;
    this.subscription = this.service.registerFarmer(this.farmerRegirstartionForm.value).subscribe(res => {
      this.snackbar.showNotification("snackbar-success", "Successful!");
      this.loading = false;
      this.farmerRegirstartionForm.reset();
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

  getSubcounties() {
    this.isLoading = true;
    this.subscription = this.service.getSubCounties().subscribe(res => {
      this.data = res;
      if (this.data.entity.length > 0) {
        this.subcounties = this.data.entity
      }
      else {

      }
    })
  }

  getWards(id: any) {
    this.subscription = this.service.getSubCountyById(id.value).subscribe(res => {
      this.data = res;
      if (this.data.entity.wards.length > 0) {
        this.wards = this.data.entity.wards;
      }
      else {
      }
    })
  }

}
