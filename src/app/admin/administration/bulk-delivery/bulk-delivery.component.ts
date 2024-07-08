import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';

@Component({
  selector: 'app-bulk-delivery',
  templateUrl: './bulk-delivery.component.html',
  styleUrls: ['./bulk-delivery.component.sass']
})
export class BulkDeliveryComponent implements OnInit {
  dcount: any
  dquantity: any
  selected = ""
  form!: FormGroup
  currentDate: any
  dataSource: MatTableDataSource<any>
  isLoading: boolean = false
  isdata: boolean = false

  displayedColumns: any = [
    // 'id',
    "farmer_no",
    'farmer',
    "quantity",
    "session",
    "collection_date",
    "route",
    "pickUpLocation",
    'action',
  ]


  constructor(private fb: FormBuilder, private dialog: MatDialog) { this.currentDate = this.getCurrentDate()}

  ngOnInit(): void {
    this.initForm()
  }

  initForm() {
    this.form = this.fb.group({
      date: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]]
    })
  }


  getTodaysUploads() {}

  onSelectionChange() {}

  uploadDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "65%"
    dialogConfig.data = {
      test: ""
    }

    this.dialog.open(UploadDialogComponent, dialogConfig)
  }

  getCurrentDate(): any {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

}
