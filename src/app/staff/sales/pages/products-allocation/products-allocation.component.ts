import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SendSmsComponent } from 'src/app/staff/sms/send-sms/send-sms.component';
import { SalesService } from '../../services/sales.service';
import { AddAllocationComponent } from '../add-allocation/add-allocation.component';
import { VerifyAccountComponent } from 'src/app/admin/users/pages/verify-account/verify-account.component';
import { VerifyproductAllocationsComponent } from '../../verifyproduct-allocations/verifyproduct-allocations.component';

@Component({
  selector: 'app-products-allocation',
  templateUrl: './products-allocation.component.html',
  styleUrls: ['./products-allocation.component.scss']
})
export class ProductsAllocationComponent implements OnInit {

  displayedColumns: string[] = [
    "id",
    "username",
    "product",
    "quantity",
    "amount",
    "allocationDate",
    "type",
    "status",
    "paymentStatus",
    "Actions",
  ];
  displayedColumns1: string[] = [
    "id",
    "username",
    "product",
    "quantity",
    "amount",
    "allocationDate",
    "type",
    "status",
    "paymentStatus",
    "Actions",
  ];
  dataSource!: MatTableDataSource<any>;
  dataSource1!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  selection = new SelectionModel<any>(true, []);
  goods: any;
  services: any;
  error: any;
  isLoading: boolean = true;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private snackbar: SnackbarService,
    private service: SalesService,
  ) { }

  ngOnInit(): void {
    this.getGoods("Good");
    this.getallcataionPerType("Service");
  }

  refresh() {
    this.getGoods("Good");
  }

  
  getGoods(type) {
    this.service.getSalesPerType(type).subscribe(
      (res) => {
        this.goods = res.entity;
        console.log("Goods"+ res.entity)
        if (this.goods != null) {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource<any>(this.goods);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getallcataionPerType(type:any) {
    this.service.getSalesPerType(type).subscribe(
      (res) => {
        this.services = res.entity;
        console.log("services"+ this.service)
        if (this.services != null) {
          this.isLoading = false;
          this.dataSource1 = new MatTableDataSource<any>(this.services);
          this.dataSource1.paginator = this.paginator;
          this.dataSource1.sort = this.sort;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }



  readMessage(message) {
    this.snackbar.showNotification("snackbar-success", message);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  verify(row) {
    console.log(row)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "40%"
    dialogConfig.data = {
      row: row
    }
    this.dialog.open(VerifyproductAllocationsComponent, dialogConfig)
  }

}
