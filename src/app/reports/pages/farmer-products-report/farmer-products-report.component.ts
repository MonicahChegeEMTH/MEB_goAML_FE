import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { FarmerLookupComponent } from 'src/app/staff/farmer/pages/farmer-lookup/farmer-lookup.component';
import { MainComponent } from '../../main/main.component';
import { ReportsService } from '../../services/reports.service';
import { DatePipe } from '@angular/common';
const MONTHS = [
  {value: 'JANUARY', name: 'JANUARY'},
  {value: 'FEBRUARY', name: 'FEBRUARY'},
  {value: 'MARCH', name: 'MARCH'},
  {value: 'APRIL', name: 'APRIL'},
  {value: 'MAY', name: 'MAY'},
  {value: 'JUNE', name: 'JUNE'},
  {value: 'JULY', name: 'JULY'},
  {value: 'AUGUST', name: 'AUGUST'},
  {value: 'SEPTEMBER', name: 'SEPTEMBER'},
  {value: 'OCTOBER', name: 'OCTOBER'},
  {value: 'NOVEMBER', name: 'NOVEMBER'},
  {value: 'DECEMBER', name: 'DECEMBER'}
];
@Component({
  selector: 'app-farmer-products-report',
  templateUrl: './farmer-products-report.component.html',
  styleUrls: ['./farmer-products-report.component.sass']
})
export class FarmerProductsReportComponent implements OnInit {

  farmerProductsForm: FormGroup
  months:any

  dialogData: any;
  loading: boolean
  title: any
  date:any
  constructor(
    public dialogRef: MatDialogRef<MainComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private service: ReportsService,
    private datePipe: DatePipe,

  ) {
    // this.title = data.data;
    // console.log("Title == ", this.title)
  }

  ngOnInit(): void {
    this.months=MONTHS

    this.farmerProductsForm = this.fb.group({
      username: ["", [Validators.required]],
      farmerNo: ["", [Validators.required]],
      month: ["", [Validators.required]],

    })
   
  }

  selectFarmer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(FarmerLookupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogData = result;
      this.farmerProductsForm.patchValue({
        username: this.dialogData.data.username,
        farmerNo: this.dialogData.data.farmer_no
      });
    });
  }
  onSubmit() {

    console.log("Form data " + this.farmerProductsForm.controls.farmerNo.value)
    this.date = this.datePipe.transform(this.farmerProductsForm.value.from, 'yyyy-MM-dd');
    this.service.generatefarmerProducts(this.farmerProductsForm.controls.farmerNo.value,this.farmerProductsForm.value.month)
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

          this.loading = false;

          this.dialogRef.close();

          this.snackbar.showNotification(
            "Report generated successfully",
            "snackbar-success"
          );
        },
        (err) => {
          console.log(err);
          this.loading = false;

          this.dialogRef.close();

          this.snackbar.showNotification(
            "Report could not be generated successfully",
            "snackbar-danger"
          );
        }
      );

  }
 
  onClick() {

  }
}