import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerLookupComponent } from 'src/app/staff/farmer/pages/farmer-lookup/farmer-lookup.component';
import { FarmerStatementComponent } from '../farmer-statement/farmer-statement.component';
import { ReportsService } from '../services/reports.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  reportCollectionForm: FormGroup;
  farmerstatementForm: FormGroup
  isloading: boolean
  collectors: any

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
      // collector: ["", [Validators.required]]

    })

  }
  generateStatement() {
    // this.color="green"
    // this.centered=true
    this.isloading = true
    // console.log(this.reportCollectionForm.value)
    this.date = this.datePipe.transform(this.reportCollectionForm.value.date, 'yyyy-MM-dd');
    console.log("Formated date is ", this.date)

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

  }

  generateCollectionsPerCollector() {
    // console.log(this.reportCollectionForm.value)
    this.date = this.datePipe.transform(this.reportCollectionForm.value.date, 'yyyy-MM-dd');
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
    this.date = this.datePipe.transform(this.reportCollectionForm.value.date, 'yyyy-MM-dd');
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





  farmerStatement() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(FarmerStatementComponent, dialogConfig)


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
