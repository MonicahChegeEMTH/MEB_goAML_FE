import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FarmerService } from '../../services/farmer.service';
import { DeleteFarmerComponent } from '../delete-farmer/delete-farmer.component';
import { FarmerDetailsComponent } from '../farmer-details/farmer-details.component';
import { RegisterFarmerComponent } from '../register-farmer/register-farmer.component';
import { UpdateFarmerComponent } from '../update-farmer/update-farmer.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-farmer-managenent',
  templateUrl: './farmer-managenent.component.html',
  styleUrls: ['./farmer-managenent.component.sass']
})
export class FarmerManagenentComponent implements OnInit {
  filterform:FormGroup
  selected = "";

  displayedColumns: string[] = [
    'id',
    "farmer_no",
    "username",
    "mobile_no",
    "ID No.",
    "route",
    'pickUpLocation',
    'action',
  ];

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  constructor(private router: Router, private dialog: MatDialog, private service: FarmerService,private fb:FormBuilder) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getData() {
    this.selected = "";
    this.isLoading = true;
    this.subscription = this.service.getFarmers().subscribe(res => {
      this.data = res;
      console.log(this.data)
      if (this.data.entity.length > 0) {
        this.isLoading = false;
        this.isdata = true;
        // Binding with the datasource
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.isdata = false;
        this.dataSource = new MatTableDataSource<any>(this.data);
      }
    },error => {
      console.log('An error occurred:', error)
      
    })
  }

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit(): void {
    this.filterform= this.fb.group({
      farmer_no: [""],
    })
    this.getData();
  }

  addCall() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "65%"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(RegisterFarmerComponent, dialogConfig)
  }

  viewFarmerDetails(data:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "65%"
    dialogConfig.data = {
      farmer: data
    }
    this.dialog.open(FarmerDetailsComponent, dialogConfig)
  }

  editCall(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "65%"
    dialogConfig.data = {
      farmer: data
    }
    this.dialog.open(UpdateFarmerComponent, dialogConfig)
  }

  deleteCall(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "40%"
    dialogConfig.data = {
      farmer: data
    }
    this.dialog.open(DeleteFarmerComponent, dialogConfig)
  }

  viewFarmerCollections(row) {

    this.router.navigate(['/staff/sales/farmer', row.id]);
  }

  // filterFarmers() {
  //   if (this.selected == 'fn') {
  //  this.getFarmerByFarmerNo();
  //   }
  // }
  getFarmerByFarmerNo(){
    this.isLoading = true;
    let farmerNo=this.filterform.value.farmer_no
    console.log(this.filterform.value.farmer_no)
      
    if (farmerNo != null && farmerNo != undefined ) {
  
      this.subscription = this.service.getByFarmersByFarmerNo(farmerNo).subscribe(res => {
        this.data = res;
        console.log(this.data.entity)
        if (this.data.entity!=null) {
          let result = []
          result.push(this.data.entity)
         
          this.isLoading = false;
          this.isdata = true;
          // Binding with the datasource
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else {
          this.isdata = false;
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(null);
        }
      })
    }
  }
}
