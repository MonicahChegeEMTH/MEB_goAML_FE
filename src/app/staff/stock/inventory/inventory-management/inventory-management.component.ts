import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
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
import { PickupService } from 'src/app/admin/pick-up-locations/pickup.service';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss']
})
export class InventoryManagementComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'salePrice',
    'profit',
    'discounted',
    'discount',
    'Stock',
    'creationDate',
    'actions'
  ];

  displayedMccColumns: string[] = [
    'id',
    'name',
    'price',
    'salePrice',
    'allocatedOn',
    'stock',
    'mcc',
    'category',
    'actions'
  ];

  centerDisplayedColumns: string[] = [
    'name',
    'price',
    'salePrice',
    'category',
    'stock'
  ];

  dataSource = new MatTableDataSource<any>();
  mccProductsDataSource!: MatTableDataSource<any>;
  centersDataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('mccPaginator') mccPaginator!: MatPaginator;
  @ViewChild('mccSort') mccSort!: MatSort;
  @ViewChild('centerPaginator') centerPaginator!: MatPaginator;
  @ViewChild('centerSort') centerSort!: MatSort;

  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  selection = new SelectionModel<any>(true, []);
  data: any[] = [];
  mccproducts: any[] = [];
  centers: any[] = [];
  selectedCenter: any = null;
  selectedCenterProducts: any[] = [];
  allAllocatedProducts: any[] = []; 

  hasdata = false;
  mccdata = false;
  centerDataAvailable = false;

  error: any;
  isLoading = true;
  hasAccess = false;
  currentUser: any;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private  service: InventoryService,
    private pickupService: PickupService
  ) {}

  ngOnInit(): void {
    console.log('InventoryManagementComponent: ngOnInit called');
    this.refresh();
  }

  ngAfterViewInit(): void {
    console.log('InventoryManagementComponent: ngAfterViewInit called');
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('DataSource paginator and sort set');
    }
    if (this.mccProductsDataSource) {
      this.mccProductsDataSource.paginator = this.mccPaginator;
      this.mccProductsDataSource.sort = this.mccSort;
      console.log('MCCProductsDataSource paginator and sort set');
    }
    if (this.centersDataSource) {
      this.centersDataSource.paginator = this.centerPaginator;
      this.centersDataSource.sort = this.centerSort;
      console.log('CentersDataSource paginator and sort set');
    }
  }

  refresh(): void {
    console.log('InventoryManagementComponent: refresh called');
    this.getData();
    this.getMccAllocations();
    this.getCenters();
    this.selectedCenter = null;
    this.selectedCenterProducts = [];
  }

  getData(): void {
    this.isLoading = true;
    console.log('InventoryManagementComponent: Fetching all products');
    this.service.getAllProducts().subscribe({
      next: (res) => {
        console.log('InventoryManagementComponent: Products received', res);
        this.data = res.productData || [];
        this.hasdata = this.data.length > 0;
        console.log(`InventoryManagementComponent: Product count = ${this.data.length}`);
        this.dataSource = new MatTableDataSource(this.data);
        if (this.paginator && this.sort) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log('InventoryManagementComponent: paginator and sort assigned to dataSource');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.hasdata = false;
        this.isLoading = false;
        this.error = err;
        console.error('InventoryManagementComponent: Error fetching products:', err);
      }
    });
  }

  getMccAllocations(): void {
    this.isLoading = true;
    console.log('InventoryManagementComponent: Fetching MCC allocations');
    this.service.getMccAllocations().subscribe({
      next: (res) => {
        console.log('InventoryManagementComponent: MCC allocations received', res);
        this.mccproducts = res.productData || [];
        this.mccdata = this.mccproducts.length > 0;
        console.log(`InventoryManagementComponent: MCC product count = ${this.mccproducts.length}`);
        this.mccProductsDataSource = new MatTableDataSource(this.mccproducts);
        if (this.mccPaginator && this.mccSort) {
          this.mccProductsDataSource.paginator = this.mccPaginator;
          this.mccProductsDataSource.sort = this.mccSort;
          console.log('InventoryManagementComponent: paginator and sort assigned to mccProductsDataSource');
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.mccdata = false;
        this.isLoading = false;
        this.error = err;
        console.error('InventoryManagementComponent: Error fetching MCC products:', err);
      }
    });
  }

  getCenters(): void {
    this.isLoading = true;
    this.pickupService.getLocations().subscribe({
      next: (res) => {
        console.log('InventoryManagementComponent: Centers received', res);
        this.centers = res.entity;
        console.log('InventoryManagementComponent: Centers count =', this.centers.length);
        this.centerDataAvailable = this.centers.length > 0;
        this.allAllocatedProducts = []; // Initialize or fetch allocated products for all centers here if available
        this.centersDataSource = new MatTableDataSource(this.centers);
        if (this.centerPaginator && this.centerSort) {
          this.centersDataSource.paginator = this.centerPaginator;
          this.centersDataSource.sort = this.centerSort;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching centers:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('InventoryManagementComponent: Applying filter to products:', value);
    if (this.dataSource) {
      this.dataSource.filter = value;
      if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
    }
  }

  mccProductFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('InventoryManagementComponent: Applying filter to MCC products:', value);
    if (this.mccProductsDataSource) {
      this.mccProductsDataSource.filter = value;
      if (this.mccProductsDataSource.paginator) this.mccProductsDataSource.paginator.firstPage();
    }
  }

  centerFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log('InventoryManagementComponent: Applying filter to centers:', value);
    if (this.centersDataSource) {
      this.centersDataSource.filter = value;
      if (this.centersDataSource.paginator) this.centersDataSource.paginator.firstPage();
    }
  }

  viewCenterDetails(center: any): void {
    console.log('InventoryManagementComponent: Viewing center details for', center);
    this.selectedCenter = center;
    this.selectedCenterProducts = center.allocatedProducts || [];
    console.log(`InventoryManagementComponent: Selected center products count = ${this.selectedCenterProducts.length}`);
  }

 onSelectCenter(center: any): void {
  console.log('InventoryManagementComponent: Center selected', center);
  this.selectedCenter = center;

  // Fetch allocated products for the selected center
  this.fetchAllocatedProducts(center.id);

  // Optional: fetch pickup locations if needed
  // this.fetchPickupLocations(center.id);

  // Attach paginator after view updates
  setTimeout(() => {
    if (this.centerPaginator) {
      this.dataSource.paginator = this.centerPaginator;
    }
  });
}


  fetchPickupLocations(centerId: string): void {
    this.pickupService.getLocationById(centerId).subscribe({
      next: (res) => {
        console.log('Pickup locations fetched for center:', centerId, res);
      },
      error: (err) => {
        console.error('Error fetching pickup locations for center:', centerId, err);
      }
    });
  }

fetchAllocatedProducts(centerId: string): void {
  console.log('InventoryManagementComponent: Fetching allocated products for center', centerId);

  const productsForCenter = this.allAllocatedProducts.filter(
    p => p.centerId === centerId
  );

  this.selectedCenterProducts = productsForCenter; // Keep for view binding
  this.centersDataSource.data = []; // Clear first

  setTimeout(() => {
    this.centersDataSource = new MatTableDataSource(productsForCenter);

    if (this.centerPaginator && this.centerSort) {
      this.centersDataSource.paginator = this.centerPaginator;
      this.centersDataSource.sort = this.centerSort;
    }

    console.log(`InventoryManagementComponent: Allocated products count for center ${centerId}:`, productsForCenter.length);
  });
}


 goBack(): void {
  console.log('InventoryManagementComponent: Going back to centers list');
  this.selectedCenter = null;

  // Re-fetch or refresh the list of centers
  this.getCenters(); // <-- make sure this method exists and reloads your data

  // Re-bind paginator and sort after data is fetched
  if (this.centerPaginator && this.centerSort) {
    this.centersDataSource.paginator = this.centerPaginator;
    this.centersDataSource.sort = this.centerSort;
  }
}

  addCall(): void {
    console.log('InventoryManagementComponent: addCall called');
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '650px';

    const dialogRef = this.dialog.open(AddStockComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('AddStockComponent dialog closed with result:', result);
      this.refresh();
    });
  }

 editCall(product: any): void {
  console.log('InventoryManagementComponent: editCall called for product:', product);
  const dialogConfig = new MatDialogConfig();
  dialogConfig.width = '700px';
  dialogConfig.height = '650px';
  dialogConfig.data = product;

  const dialogRef = this.dialog.open(EditStockComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(updatedData => {
    console.log('EditStockComponent dialog closed with result:', updatedData);

    if (updatedData) {
      // Call your API to update the product
      this.service.updateProduct(product.id, updatedData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.refresh();
        },
        error: (error) => {
          console.error('Failed to update product:', error);
        }
      });
    }
  });
}


   deleteCall(product: any): void {
    console.log('InventoryManagementComponent: deleteCall called for product:', product);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.data = {
      product
    };

    const dialogRef = this.dialog.open(DeleteStockComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      console.log('DeleteStockComponent dialog closed with result:', result);
      if (result === 'confirmed') {
        this.service.deleteProduct(product.id).subscribe({
          next: (response) => {
            console.log('Product deleted successfully:', response);
            this.refresh();
          },
          error: (error) => {
            console.error('Failed to delete product:', error);
          }
        });
      }
    });
  }


  // Your requested new methods for update and delete product dialogs

  editProduct(product: any): void {
    console.log('InventoryManagementComponent: Update product called for', product);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '700px';
    dialogConfig.height = '650px';
    dialogConfig.data = product;

    const dialogRef = this.dialog.open(EditStockComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('EditStockComponent dialog closed with result:', result);
      this.refresh();
    });
  }

  deleteProduct(product: any): void {
    console.log('InventoryManagementComponent: Delete product called for', product);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = '300px';
    dialogConfig.data = product;

    const dialogRef = this.dialog.open(DeleteStockComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('DeleteStockComponent dialog closed with result:', result);
      this.refresh();
    });
  }
}
