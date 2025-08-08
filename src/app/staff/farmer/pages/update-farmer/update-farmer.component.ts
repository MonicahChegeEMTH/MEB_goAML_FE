import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CountiesService } from 'src/app/admin/counties/counties.service';
import { PickupService } from 'src/app/admin/pick-up-locations/pickup.service';
import { RoutesService } from 'src/app/admin/routes/routes.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerService } from '../../services/farmer.service';
import { FarmerManagenentComponent } from '../farmer-managenent/farmer-managenent.component';

@Component({
  selector: 'app-update-farmer',
  templateUrl: './update-farmer.component.html',
  styleUrls: ['./update-farmer.component.sass']
})
export class UpdateFarmerComponent implements OnInit {

  farmerEditForm: FormGroup;
  bankDetailsForm: FormGroup;
  farmer: any
  loading = false;
  isLoading: Boolean
  isdata: Boolean
  subcounties: any[] = []
  wards: any;
  counties: any;
  routes: any;
  banks: any = { "count": 45,
    "list": [
      {
        name: 'MPESA',
        code: '68',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 649,
      },
      {
        name: 'EQUITY BANK',
        code: '68',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 609,
      },
      {
        name: 'ABSA BANK',
        code: '3',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 611,
      },
      {
        name: 'COOPERATIVE BANK',
        code: '11',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 616,
      },
      {
        name: 'FAMILY BANK',
        code: '70',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 625,
      },
      {
        name: 'WANANCHI SACCO LTD',
        code: '70',
        payPointType: 'SACCO',
        status: 'ACTIVE',
        id: 547
      },
      {
        name: 'Boresha Sacco',
        code: '70',
        payPointType: 'SACCO',
        status: 'ACTIVE',
        id: 547
      },
      {
        name: 'TOWER SACCO',
        code: '70',
        payPointType: 'SACCO',
        status: 'ACTIVE',
        id: 547
      },
      {
        name: 'CONSOLIDATED BANK OF KENYA LTD',
        code: '23',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 618,
      },
      {
        name: 'DIAMOND TRUST BANK',
        code: '63',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 621,
      },
      {
        name: 'ECOBANK KENYA LTD',
        code: '43',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 623,
      },
      {
        name: 'JAMII BORA BANK LTD',
        code: '51',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 636,
      },
      {
        name: 'KCB Bank',
        code: '1',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 650,
      },
      {
        name: 'SMEP Bank',
        code: '21',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 637
      },
      {
        name: 'NATIONAL BANK OF KENYA',
        code: '12',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 639,
      },
      {
        name: 'PRIME BANK LIMITED',
        code: '10',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 643,
      },
      {
        name: 'SIDIAN BANK',
        code: '66',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 637,
      },
      {
        name: 'STANBIC BANK KENYA LIMITED',
        code: '31',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 644,
      },
      {
        name: 'STANDARD CHARTERED',
        code: '2',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 645,
      },
      {
        name: 'VICTORIA COMMERCIAL BANK LTD',
        code: '54',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 648,
      },
    ] };

  constructor(public dialogRef: MatDialogRef<FarmerManagenentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private countiesService: CountiesService,
    private routesService: PickupService,
    private service: FarmerService) { }
  subscription!: Subscription;

 ngOnInit(): void {
   console.log('Data received from dialog:', JSON.stringify(this.data, null, 2));
   console.log('Farmer ID:', this.data.farmer?.id);

   if (!this.data.farmer?.id) {
     this.snackbar.showNotification('error', 'Invalid farmer ID');
     this.isLoading = false;
     this.dialogRef.close();
     return;
   }

   this.isLoading = true;
   this.subscription = this.service.getFarmersById(this.data.farmer.id).subscribe({
     next: (res) => {
       console.log('getFarmersById response:', JSON.stringify(res, null, 2));
       this.isLoading = false;
       if (!res?.entity) {
         this.snackbar.showNotification('error', 'No farmer data found');
         this.dialogRef.close();
         return;
       }

       this.farmer = res.entity;
       console.log('Farmer details:', JSON.stringify(this.farmer, null, 2));

       // Initialize bankDetailsForm with default values
       this.bankDetailsForm = this.fb.group({
         branch: [this.farmer.bankDetails?.branch || '', [Validators.required]],
         bankName: [this.farmer.bankDetails?.bankName || '', [Validators.required]],
         accountNumber: [this.farmer.bankDetails?.accountNumber || '', [Validators.required]],
         accountName: [this.farmer.bankDetails?.accountName || '', [Validators.required]],
       });

       // Initialize farmerEditForm with fallback values
       this.farmerEditForm = this.fb.group({
         id: [this.farmer.id || this.data.farmer.id || ''],
         bankDetails: [''],
         transportMeans: [this.farmer.transportMeans || ''],
         firstName: [this.farmer.firstName || this.data.farmer.username?.split(' ')[0] || '', [Validators.required]],
         lastName: [this.farmer.lastName || this.data.farmer.username?.split(' ')[1] || '', [Validators.required]],
         idNumber: [this.farmer.idNumber || this.farmer.id_number || this.data.farmer.id_number || '', [Validators.required]],
         farmerNo: [this.farmer.farmerNo || this.farmer.farmer_no || this.data.farmer.farmer_no || '', [Validators.required]],
         mobileNo: [this.farmer.mobileNo || this.farmer.mobile_no || this.data.farmer.mobile_no || '', [Validators.required]],
         address: [this.farmer.address || ''],
         subcounty_fk: [this.farmer.subcounty_fk || '', [Validators.required]],
         wardFk: [this.farmer.wardFk || '', [Validators.required]],
         memberType: [this.farmer.memberType || '', [Validators.required]],
         alternativeMobileNo: [this.farmer.alternativeMobileNo || ''],
         noOfCows: [this.farmer.noOfCows || '', [Validators.required]],
         county_fk: [this.farmer.county_fk || '', [Validators.required]],
         location: [this.farmer.location || '', [Validators.required]],
         subLocation: [this.farmer.subLocation || '', [Validators.required]],
         village: [this.farmer.village || '', [Validators.required]],
         paymentFreequency: [this.farmer.paymentFreequency || ''],
         paymentMode: [this.farmer.paymentMode || '', [Validators.required]],
         gender: [this.farmer.gender || '', [Validators.required]],
         route: [this.farmer.routeFk || this.farmer.route || this.data.farmer.route || ''],
         routeFk: [this.farmer.routeFk || '']
       });

       // Fetch wards only if subcounty_fk exists
       if (this.farmer.subcounty_fk) {
         this.getWards(this.farmer.subcounty_fk);
       }

       this.getSubcounties();
       this.getCounties();
       this.getRoutes();
     },
     error: (err) => {
       console.error('Error fetching farmer by ID:', err);
       this.isLoading = false;
       this.snackbar.showNotification('error', 'Failed to load farmer data: ' + (err.message || 'Unknown error'));
       this.dialogRef.close();
     }
   });
 }

  onSubmit() {
    this.loading = true;
    this.farmerEditForm.value.bankDetails = this.bankDetailsForm.value;
    console.log("Farmer updated details "+ this.farmerEditForm.value)
    this.subscription = this.service.updateFarmer(this.farmerEditForm.value).subscribe(res => {
      this.snackbar.showNotification("snackbar-success", "Successful!");
      this.loading = false;
      this.farmerEditForm.reset();
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
        this.subcounties = [];
      }
    this.isLoading = false;
    })
  }

  getCounties() {
    this.subscription = this.countiesService.getCounties().subscribe(res => {
      if (res.entity.length > 0) {
        this.counties = res.entity;
      }
      else {
        this.counties = [];
      }
    })
  }

  getRoutes() {
    this.subscription = this.routesService.getRoutes().subscribe(res => {
      if (res.entity.length > 0) {
        this.routes = res.entity;
      }
      else {
        this.routes = [];
      }
    })
  }

  getWards(id: any) {
    console.log("Getting wards  from subcounty id ...",id?.value)
    this.subscription = this.service.getSubCountyById(id?.value).subscribe(res => {
      this.data = res;
      if(this.data.entity.wards) {
        if (this.data.entity.wards.length > 0) {
          this.wards = this.data.entity.wards;
        }
        else {
        }
      }
    })
  }

}
