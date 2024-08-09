import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AddStockComponent } from '../add-stock/add-stock.component';
import { DeleteStockComponent } from '../delete-stock/delete-stock.component';
import { EditStockComponent } from '../edit-stock/edit-stock.component';
import { InventoryService } from '../inventory.service';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "name",
    "price",
    "salePrice",
    "profit",
    "discounted",
    "discount",
    "Stock",
    "creationDate",
    "actions",
  ];

  displayedMccColumns: string[] = [
    "id",
    "name",
    "price",
    "salePrice",
    "allocatedOn",
    "stock",
    "mcc",
    "category",
    "actions",
  ];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild('mccPaginator') mccPaginator: MatPaginator
  @ViewChild('mccSort') mccSort: MatSort
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  mccProductsDataSource: MatTableDataSource<any>;
  mccdata: boolean = false

  selection = new SelectionModel<any>(true, []);
  data: any;
  mccproducts: any
  hasdata: boolean = false
  error: any;
  isLoading: boolean = true;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private service: InventoryService,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.getMccAllocations();
  }

  refresh() {
    this.getData();
  }

  getData() {
    this.isLoading = true
    this.service.getAllProducts().subscribe(
      (res) => {
        this.data = res.productData;
        this.isLoading = !this.isLoading;
        if (this.data != null) {
          this.hasdata = true
          this.dataSource = new MatTableDataSource<any>(this.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      (err) => {
        this.hasdata = false
        this.isLoading = false
        console.log(err);
      }
    );
  }

  getMccAllocations() {
    this.isLoading = true
    this.service.getMccAllocations().subscribe(
      (res) => {
        this.mccproducts = res.productData;
        this.isLoading = !this.isLoading;
        if (this.mccproducts.length > 0) {
          this.mccdata = true
          this.mccProductsDataSource = new MatTableDataSource<any>(this.mccproducts);
          this.mccProductsDataSource.paginator = this.mccPaginator;
          this.mccProductsDataSource.sort = this.sort;
        } else {
          this.mccdata = false
          this.isLoading = false
        }
      },
      (err) => {
        this.mccdata = false
        this.isLoading = false
        console.log(err);
      }
    );
  }

  hasAccess: boolean;

  addCall() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(AddStockComponent, dialogConfig)
    this.dialog.afterAllClosed.subscribe({
      next: () => {
        this.ngOnInit();
      }
    })
  }

  editCall(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {
      stock: data
    }
    this.dialog.open(EditStockComponent, dialogConfig)
    this.dialog.afterAllClosed.subscribe({
      next: (res) => {
        this.getData()
      }
    })
  }

  deleteCall(data: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "40%"
    dialogConfig.data = {
      stock: data
    }
    this.dialog.open(DeleteStockComponent, dialogConfig)
    this.dialog.afterAllClosed.subscribe({
      next: () => {
        this.ngOnInit();
      }
    })
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mccProductFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.mccProductsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.mccProductsDataSource.paginator) {
      this.mccProductsDataSource.paginator.firstPage();
    }
  }

}
