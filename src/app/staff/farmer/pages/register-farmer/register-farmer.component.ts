import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CountiesService } from 'src/app/admin/counties/counties.service';
import { PickupService } from 'src/app/admin/pick-up-locations/pickup.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerService } from '../../services/farmer.service';
import { FarmerManagenentComponent } from '../farmer-managenent/farmer-managenent.component';
import { RoutesService } from 'src/app/admin/routes/routes.service';

@Component({
  selector: 'app-register-farmer',
  templateUrl: './register-farmer.component.html',
  styleUrls: ['./register-farmer.component.scss'],
})
export class RegisterFarmerComponent implements OnInit {
  farmerRegirstartionForm: FormGroup;
  bankDetailsForm: FormGroup;
  loading = false;
  isLoading: Boolean;
  isdata: Boolean;
  subcounties: any[] = [];
  wards: any;
  counties: any;
  routes: any;
  banks: any = {
    count: 45,
    list: [
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
        name: 'BARCLAYS BANK OF KENYA LIMITED',
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
        name: 'COMMERCIAL BANK OF AFRICA LTD',
        code: '7',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 617,
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
        name: 'FAMILY BANK LTD',
        code: '70',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 625,
      },
      {
        name: 'MWANANCHI SACCO',
        code: '70',
        payPointType: 'SACCO',
        status: 'ACTIVE',
        id: 547
      },
      {
        name: 'JAMII BORA BANK LTD',
        code: '51',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 636,
      },
      {
        name: 'KCB BANK',
        code: '1',
        payPointType: 'BANK',
        status: 'ACTIVE',
        id: 650,
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
    ],
  };

  constructor(
    public dialogRef: MatDialogRef<FarmerManagenentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private countiesService: CountiesService,
    private routesService: PickupService,
    private service: FarmerService,
    
    private routeService: RoutesService
  ) {}
  subscription!: Subscription;

  ngOnInit(): void {
    this.getSubcounties();
    this.getCounties();
    this.getRoutes();
    

    this.bankDetailsForm = this.fb.group({
     
      branch: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
    });

    this.farmerRegirstartionForm = this.fb.group({
      bankDetails: [''],
      transportMeans: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      idNumber: ['', [Validators.required]],
      mobileNo: ['', [Validators.required]],
      subcounty_fk: ['', [Validators.required]],
      wardFk: ['', [Validators.required]],
      memberType: ['', [Validators.required]],
      alternativeMobileNo: [''],
      noOfCows: ['', [Validators.required]],
      paymentMode:['',[Validators.required]],
      county_fk: [''],
      location: [''],
      subLocation: [''],
      village: [''],
      paymentFreequency: ['',[Validators.required]],
      gender: [''],
      routeFk: [''],
      
    });
  }


  onSubmit() {
    this.loading = true;
    this.farmerRegirstartionForm.value.bankDetails = this.bankDetailsForm.value;

    console.log("Farmer Registration Details ", this.farmerRegirstartionForm.value)
    this.subscription = this.service
      .registerFarmer(this.farmerRegirstartionForm.value)
      .subscribe(
        (res: any) => {
          const farmer = res.entity
          this.snackbar.showNotification('snackbar-success', 'Farmer No: ' +farmer.farmerNo + ', '+farmer.username+ ' added Successfully');
          this.loading = false;
          this.farmerRegirstartionForm.reset();
          this.dialogRef.close();
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification('snackbar-danger', err);
          this.dialogRef.close();
        }
      );
  }

  onClick() {
    this.dialogRef.close();
  }



  getSubcounties() {
    this.isLoading = true;

    
    this.subscription = this.service.getSubCounties().subscribe(res => {
      
      console.log(res)
    
      if (res.entity.length > 0) {
        this.subcounties = res.entity;
      } else {
        this.subcounties = [];
      }
    });
  }

  getCounties() {
    this.subscription = this.countiesService.getCounties().subscribe((res) => {
      if (res.entity.length > 0) {
        this.counties = res.entity;
      } else {
        this.counties = [];
      }
    });
  }

  // getPickUpLocations() {
  //   this.subscription = this.routesService.getLocations().subscribe((res) => {
  //     if (res.entity.length > 0) {
  //       this.routes = res.entity;
  //     } else {
  //       this.routes = [];
  //     }
  //   });
  // }

  getRoutes() {
    this.subscription = this.routeService.getRoutes().subscribe((res) => {
      if (res.entity.length > 0) {
        this.routes = res.entity;

        console.log("Routes ", this.routes)
      } else {
        this.routes = [];
      }
    });
  }

  getWards(id: any) {
    this.subscription = this.service
      .getSubCountyById(id.value)
      .subscribe((res) => {
        this.data = res;
        if (this.data.entity.wards.length > 0) {
          this.wards = this.data.entity.wards;
        } else {
        }
      });
  }
}
