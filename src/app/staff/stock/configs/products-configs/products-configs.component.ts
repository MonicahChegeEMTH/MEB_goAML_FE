import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { AddProductConfigComponent } from '../add-product-config/add-product-config.component';
import { ConfigsService } from '../configs.service';
import { DeleteProductConfigComponent } from '../delete-product-config/delete-product-config.component';
import { EditProductConfigComponent } from '../edit-product-config/edit-product-config.component';
import { error } from 'console';
import { AddProductPriceComponent } from '../add-product-price/add-product-price.component';

@Component({
  selector: 'app-products-configs',
  templateUrl: './products-configs.component.html',
  styleUrls: ['./products-configs.component.sass']
})
export class ProductsConfigsComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "product_name",
    "buying_price",
    // "selling_price",
    "quantity",
    "unit_measurement",
    "route",
    "effective_from",
    "actions"
  ];

  displayedPriceColumns: string[] = [
    "id",
    "mcc",
    "product_name",
    "selling_price",
    "buying_price",
    "category",
    "effective_from",
    "actions"
  ];

  pricesDataSource!: MatTableDataSource<any>;

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  isLoading = true;
  isdata: boolean;
  pricesdata: boolean = false
  configs: any;
  prices: any

  constructor(
    private service: ConfigsService,
    public dialog: MatDialog,
    private snackbar: SnackbarService,
  ) {
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit(): void {
    this.getAllConfigurations();
    this.getProductPrices()
  }

  refresh() {
    this.getAllConfigurations();
  }


  getAllConfigurations() {
    this.service.getConfigs()
      .subscribe(
        (res) => {
          this.configs = res.entity
          if (this.configs.length > 0) {
            this.isLoading = false;
            this.isdata = true;
            this.dataSource = new MatTableDataSource<any>(this.configs);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
          else {
            this.isLoading = false;
            this.isdata = false;
            this.dataSource = new MatTableDataSource<any>(this.configs);
          }
        },
        (error) => {
          this.isLoading = false;
          this.isdata = false;
        }
      );
  }
  

  getProductPrices() {
    this.isLoading = true;
    this.service.getProductPrices()
      .subscribe({
        next: (res) => {
          this.prices = res.entity
          if (this.prices.length > 0) {
            this.isLoading = false;
            this.pricesdata = true;
            this.pricesDataSource = new MatTableDataSource<any>(this.prices);
            this.pricesDataSource.paginator = this.paginator;
            this.pricesDataSource.sort = this.sort;
          }
          else {
            this.isLoading = false;
            this.pricesdata = false;
            this.pricesDataSource = new MatTableDataSource<any>(this.prices);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.pricesdata = false;
        }
      }
      );
  }

  addNew() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(AddProductConfigComponent, dialogConfig)
  }

  addPriceDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {},
    this.dialog.open(AddProductPriceComponent, dialogConfig);
  }

  edit(config) {
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {
      configs: config
    }
    this.dialog.open(EditProductConfigComponent, dialogConfig)
  }

  delete(config) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "40%"
    dialogConfig.data = {
      configs: config
    }
    this.dialog.open(DeleteProductConfigComponent, dialogConfig)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}