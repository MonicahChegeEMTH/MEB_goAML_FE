import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerService } from '../../services/farmer.service';
import { FarmerManagenentComponent } from '../farmer-managenent/farmer-managenent.component';

@Component({
  selector: 'app-register-farmer',
  templateUrl: './register-farmer.component.html',
  styleUrls: ['./register-farmer.component.scss']
})
export class RegisterFarmerComponent implements OnInit {

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
      username: ["", [Validators.required]],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      bankAccountNo: ["", [Validators.required]],
      idNumber: ["", [Validators.required]],
      mobileNo: ["", [Validators.required]],
      address: ["", [Validators.required]],
      subcounty_fk: ["", [Validators.required]],
      wardFk: ["", [Validators.required]],
      memberType: ["", [Validators.required]],
      alternativeMobileNo: ["", [Validators.required]],
      noOfCows: ["", [Validators.required]],
    })

    this.getSubcounties()
      ;
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
