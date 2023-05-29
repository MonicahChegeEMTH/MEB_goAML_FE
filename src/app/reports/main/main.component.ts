import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerLookupComponent } from 'src/app/staff/farmer/pages/farmer-lookup/farmer-lookup.component';
import { FarmerStatementComponent } from '../farmer-statement/farmer-statement.component';
import { ReportsService } from '../services/reports.service';
import { StatmentComponent } from '../pages/statment/statment.component';
import { FarmerProductsReportComponent } from '../pages/farmer-products-report/farmer-products-report.component';
import { LookupPickUpLocationsComponent } from 'src/app/staff/sales/pages/lookup-pick-up-locations/lookup-pick-up-locations.component';
import { saveAs } from 'file-saver';
const MONTHS = [
  { value: 'JANUARY', name: 'JANUARY' },
  { value: 'FEBRUARY', name: 'FEBRUARY' },
  { value: 'MARCH', name: 'MARCH' },
  { value: 'APRIL', name: 'APRIL' },
  { value: 'MAY', name: 'MAY' },
  { value: 'JUNE', name: 'JUNE' },
  { value: 'JULY', name: 'JULY' },
  { value: 'AUGUST', name: 'AUGUST' },
  { value: 'SEPTEMBER', name: 'SEPTEMBER' },
  { value: 'OCTOBER', name: 'OCTOBER' },
  { value: 'NOVEMBER', name: 'NOVEMBER' },
  { value: 'DECEMBER', name: 'DECEMBER' }
];
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  reportCollectionForm: FormGroup;
  farmerstatementForm: FormGroup
  collectionPerpLocationsForm: FormGroup
  reportCollectionForm2: FormGroup
  reportCollectionForm3: FormGroup
  reportCollectionFormp:FormGroup
  paymentFileForm: FormGroup
  reportCollectionFormm:FormGroup
  isloading: boolean
  collectors: any
  months: any

  centered = false;
  // radius: number;
  color: string;

  @ViewChild(MatAccordion) accordion: MatAccordion;
  dialogData: any;
  date: string;


  constructor(
    // public dialogRef: MatDialogRef<MainComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private snackbar: SnackbarService,
    private service: ReportsService,
  ) { }

  ngOnInit(): void {
    this.reportCollectionForm = this.fb.group({

      date: ["", [Validators.required]],
      format: ["", [Validators.required]],
      
    
    })
    this.reportCollectionForm2 = this.fb.group({

      date: ["", [Validators.required]],
      // format: ["", [Validators.required]],

    })
    this.reportCollectionForm3 = this.fb.group({

      date: ["", [Validators.required]],
      // format: ["", [Validators.required]],
    
    })
    this.reportCollectionFormp = this.fb.group({

      date: ["", [Validators.required]],
      // format: ["", [Validators.required]],
    
    })
    this.reportCollectionFormm = this.fb.group({

      month: ["", [Validators.required]],
      // format: ["", [Validators.required]],
    
    })

    this.collectionPerpLocationsForm = this.fb.group({

      date: ["", [Validators.required]],
      format: ["", [Validators.required]],
      pul: ["", [Validators.required]],
      locationId: ["", [Validators.required]],

    })


    this.months = MONTHS

    this.paymentFileForm = this.fb.group(
      {
        month: ["", [Validators.required]],
        mode: ["", [Validators.required]],
        pul: ["", [Validators.required]],
        locationId: ["", [Validators.required]],
      }
    )

  }
  generateDateReport() {
    // this.color="green"
    // this.centered=true
    this.isloading = true
    let format = this.reportCollectionForm.value.format
    this.date = this.datePipe.transform(this.reportCollectionForm.value.date, 'yyyy-MM-dd');
    if (format == "pdf") {

      this.service.collectionsPerDate(this.date)
        .subscribe(
          (response) => {
            console.log(response)
            let url = window.URL.createObjectURL(response.data);

            // if you want to open PDF in new tab
            window.open(url);

            let a = document.createElement("a");
            document.body.appendChild(a);
            a.setAttribute("style", "display: none");
            a.setAttribute("target", "blank");
            a.href = url;
            a.download = response.filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();

            this.isloading = false;



            this.snackbar.showNotification(
              "Report generated successfully",
              "snackbar-success"
            );
          },
          (err) => {
            console.log(err);
            this.isloading = false

            this.snackbar.showNotification(
              "Report could not be generated successfully",
              "snackbar-danger"
            );
          }
        );
    } else if (format == "excel") {
      console.log("File format picked = " + format)
      console.log("Formated Date = " + this.date)
      this.service.collectionsPerDateExcel(this.date).subscribe(
        (response: Blob) => {
          this.isloading = false
          const filename = 'collections_per_date.xlsx'; // Specify the desired filename with the appropriate extension
          saveAs(response, filename);
        },
        error => {
          console.error('Failed to download report:', error);
        }
      );
    }

  }

  generateCollectionsPerCollector() {
    // console.log(this.reportCollectionForm.value)
    this.date = this.datePipe.transform(this.reportCollectionForm2.value.date, 'yyyy-MM-dd');
    console.log("Formated date is ", this.date)
    this.isloading = true
    this.service.collectionsPerCollectorByDate(this.date)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;

          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }

  generateCollectionsPerLocations() {
    // console.log(this.reportCollectionForm.value)
    this.date = this.datePipe.transform(this.reportCollectionForm3.value.date, 'yyyy-MM-dd');
    console.log("Formated date is ", this.date)
    this.isloading = true
    this.service.collectionsPerLocationrByDate(this.date)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }
  generateCollectionsPerLocationsp() {
    // console.log(this.reportCollectionForm.value)
    this.date = this.datePipe.transform(this.reportCollectionFormp.value.date, 'yyyy-MM-dd');
    console.log("Formated date is ", this.date)
    this.isloading = true
    this.service.collectionsPerLocationrByDatep(this.date)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }
  generateCollectionsPerLocationsm() {
    // console.log(this.reportCollectionForm.value)
    
    
    this.isloading = true
    this.service.collectionsPerLocationrByMonth(this.reportCollectionFormm.value.month)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }

  selectPickUpLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(LookupPickUpLocationsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogData = result;
      this.collectionPerpLocationsForm.patchValue({
        pul: this.dialogData.data.name,
        locationId: this.dialogData.data.id
      });
    });
  }
  choosePickUpLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(LookupPickUpLocationsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogData = result;
      this.paymentFileForm.patchValue({
        pul: this.dialogData.data.name,
        locationId: this.dialogData.data.id
      });
    });
  }

  
  generatePaymentFile() {
    console.log("Paymentfile Form Data"+ this.paymentFileForm.value.pul)
    console.log("Paymentfile Form Data"+ this.paymentFileForm.value.locationId)
    this.isloading = true
    this.service.getPaymentFile(this.paymentFileForm.value.locationId,this.paymentFileForm.value.month, this.paymentFileForm.value.mode)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }
  generateCollectionsPerPickUpLocations() {
    this.isloading = true
   let format=this.collectionPerpLocationsForm.value.format
    this.date = this.datePipe.transform(this.collectionPerpLocationsForm.value.date, 'yyyy-MM-dd');
    console.log("Formated date " + this.date)
    if(format=="pdf"){
    this.service.collectionsPerPulByDate(this.collectionPerpLocationsForm.value.locationId, this.date)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );
      }else if (format == "excel") {
        console.log("File format picked = " + format)
        console.log("Formated Date = " + this.date)
        this.service.collectionsPerMCCandDateExcel(this.collectionPerpLocationsForm.value.locationId,this.date).subscribe(
          (response: Blob) => {
            this.isloading = false
            const filename = 'collections_per_date.xlsx'; // Specify the desired filename with the appropriate extension
            saveAs(response, filename);
          },
          error => {
            console.error('Failed to download report:', error);
          }
        );
      }
  }
  generateTotalCollectionsPerPickUpLocations() {
    this.isloading = true
    console.log(this.collectionPerpLocationsForm.value)
    this.date = this.datePipe.transform(this.collectionPerpLocationsForm.value.date, 'yyyy-MM-dd');
    console.log("Formated date " + this.date)
    this.service.collectionsPerPulByDate(this.collectionPerpLocationsForm.value.locationId, this.date)
      .subscribe(
        (response) => {
          console.log(response)
          let url = window.URL.createObjectURL(response.data);

          // if you want to open PDF in new tab
          window.open(url);

          let a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("style", "display: none");
          a.setAttribute("target", "blank");
          a.href = url;
          a.download = response.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();

          this.isloading = false;



          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.isloading = false

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );
  }




  farmerCollectionsReport() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      data: ""
    }
    this.dialog.open(FarmerStatementComponent, dialogConfig)


  }
  farmerProductReport() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      data: ""
    }
    this.dialog.open(FarmerProductsReportComponent, dialogConfig)


  }
  farmerStatement() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      data: ""
    }
    this.dialog.open(StatmentComponent, dialogConfig)


  }
  DailyCOllectionReport() {

  }
  collectionsPerLocation(title: any) {

  }
  collectionsPerCollector(title: any) {

  }
  onClick() {

  }
}
