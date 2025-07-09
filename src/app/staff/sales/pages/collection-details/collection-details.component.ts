import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatMenuTrigger } from '@angular/material/menu';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportsService } from 'src/app/reports/services/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SalesService } from '../../services/sales.service';

interface Collection {
  quantity: number;
  amount: number;
  collector: string;
  collection_date: string;
  paymentStatus: string;
}

interface Allocation {
  id: string;
  time: string;
  product: string;
  username: string;
  amount: number;
  paymentStatus: string;
  quantity: number;
  allocationDate: string;
}

interface Farmer {
  id: string;
  username: string;
  [key: string]: any;
}

interface ApiResponse<T> {
  entity: T;
}

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss'],
})
export class CollectionDetailsComponent implements OnInit {
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().slice(0, 10);

  form: FormGroup;

  displayedColumns: string[] = [
    'select',
    'quantity',
    'amount',
    'collector',
    // 'pickUpLocation',
    'collection_date',
    'paid',
  ];

  allocationsDisplayedColumns: string[] = [
    'id',
    //'time',
    'product',
    'username',
    'amount',
    'paymentStatus',
    'quantity',
    'allocationDate',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(MatMenuTrigger) contextMenu!: MatMenuTrigger;
  @ViewChild('allocationsPaginator') allocationsPaginator!: MatPaginator;
  @ViewChild('allocationSort') collectorsSort!: MatSort;

  contextMenuPosition = { x: '0px', y: '0px' };

  selection = new SelectionModel<Collection>(true, []);
  dataSource!: MatTableDataSource<Collection>;
  allocationsDataSource!: MatTableDataSource<Allocation>;

  farmer: Farmer | null = null;
  farmerNo: string = '';
  isdata = false;
  isLoading = false;
  present = false;
  startDate: string = '';
  endDate: string = '';
  originalAllocations: any[] = [];

  allData: any[] = [];

  quantity = 0;
  allocationsArray: Allocation[] = [];
  allocationsNotAdded = true;
  amountOnAllocatedItems = 0;
  payedAccruals = 0;
  notPayedAccruals = 0;
  amountPayedOnCollections = 0;
  amountNotPayedOnCollections = 0;

  // Declare the missing 'data' property
  data!: ApiResponse<Collection[]>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private service: SalesService,
    private reportservice: ReportsService,
    private snackbar: SnackbarService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.form = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
    });

    this.route.params.subscribe((params: Params) => {
      this.farmerNo = params['fno'];
      console.log('FarmerNo from route:', this.farmerNo);
      this.initializeData();
    });
  }

  initializeData(): void {
    console.log('Initializing data...');
    this.getByFarmerNo(this.farmerNo);
    this.getTodaysCollections();
    this.getFarmerAllocations(this.farmerNo);
    this.getPayedFarmerAccruals(this.farmerNo);
    this.getNonPayedFarmerAccruals(this.farmerNo);
    this.getFarmerAmountOnPayedCollections(this.farmerNo);
    this.getFarmerAmountOnNotPayedCollections(this.farmerNo);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getByFarmerNo(farmerNo: string): void {
    console.log('Fetching farmer by number:', farmerNo);
    this.service.getByFarmerNo(farmerNo).subscribe((res: ApiResponse<Farmer>) => {
      console.log('Farmer response:', res);
      this.farmer = res.entity;
      this.present = !!this.farmer?.username;
      console.log('Farmer set:', this.farmer, 'Present:', this.present);
    });
  }

  getTodaysCollections(): void {
    this.isLoading = true;
    this.service.filterCollections(this.farmerNo, this.today, this.today).subscribe((res: ApiResponse<Collection[]>) => {
      this.data = res;

      if (this.data.entity.length > 0) {
        this.isLoading = false;
        this.isdata = true;
        this.quantity = this.data.entity.reduce((sum, current) => sum + current.quantity, 0.0);

        // Binding with the datasource
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        console.log('Collections loaded. Total quantity:', this.quantity);
      }
      this.isLoading = false; // Ensure isLoading is set to false even if no data
    });
  }

  filterCollections(): void {
    if (this.form.valid) {
      const from = this.datePipe.transform(this.form.value.from, 'yyyy-MM-dd')!;
      const to = this.datePipe.transform(this.form.value.to, 'yyyy-MM-dd')!;
      console.log('Filtering collections from', from, 'to', to);
      this.isLoading = true;
      this.service.filterCollections(this.farmerNo, from, to).subscribe((res: ApiResponse<Collection[]>) => {
        this.data = res;

        if (this.data.entity.length > 0) {
          this.isLoading = false;
          this.isdata = true;
          this.quantity = this.data.entity.reduce((sum, current) => sum + current.quantity, 0.0);

          // Binding with the datasource
          this.dataSource = new MatTableDataSource(this.data.entity);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        }
        this.isLoading = false; // Ensure isLoading is set to false even if no data
      });
    } else {
      this.snackbar.showNotification('snackbar-danger', 'From and To dates are required');
    }
  }

  // Add the missing filterByDateRange method
  filterByDateRange(): void {
    if (this.startDate && this.endDate) {
      const from = this.datePipe.transform(this.startDate, 'yyyy-MM-dd')!;
      const to = this.datePipe.transform(this.endDate, 'yyyy-MM-dd')!;
      console.log('Filtering allocations from', from, 'to', to);
      this.isLoading = true;
      this.service.getFarmerAllocations(this.farmerNo).subscribe((res) => {
        this.allocationsArray = res.entity.filter((allocation: Allocation) => {
          const allocationDate = this.datePipe.transform(allocation.allocationDate, 'yyyy-MM-dd')!;
          return allocationDate >= from && allocationDate <= to;
        });

        if (this.allocationsArray.length > 0) {
          this.allocationsNotAdded = false;
          this.amountOnAllocatedItems = this.allocationsArray.reduce((sum, allocation) => sum + allocation.amount, 0);
          this.allocationsDataSource = new MatTableDataSource(this.allocationsArray);
          this.allocationsDataSource.paginator = this.allocationsPaginator;
        } else {
          this.allocationsNotAdded = true;
          this.allocationsDataSource = new MatTableDataSource([]);
        }
        this.isLoading = false;
      });
    } else {
      this.snackbar.showNotification('snackbar-danger', 'Please select both start and end dates');
    }
  }

  getFarmerAllocations(id) {
    this.service.getFarmerAllocations(id).subscribe((res) => {
      this.allocationsArray = res.entity;

      if (this.allocationsArray.length > 0) {
        this.allocationsNotAdded = false;

        this.allocationsArray.forEach(allocation => {
          this.amountOnAllocatedItems = this.amountOnAllocatedItems + allocation.amount;
        })
     
        this.allocationsDataSource = new MatTableDataSource(this.allocationsArray);
        this.allocationsDataSource.paginator = this.allocationsPaginator;
      } else {
        this.isdata = false;
        this.isLoading = false;
      }
    });
  }

  refreshAllocations(){
    this.getFarmerAllocations(this.farmerNo)
  }

  generateSTatement(farmerId: string, from: string, to: string): void {
    console.log('Generating statement for:', farmerId, 'from', from, 'to', to);
    this.reportservice.generatefarmerCollections(farmerId, from, to).subscribe({
      next: (response) => {
        console.log('Statement generation successful');
        const url = window.URL.createObjectURL(response.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        this.snackbar.showNotification('snackbar-success', 'Report generated successfully');
      },
      error: (err) => {
        console.error('Error generating statement:', err);
        this.snackbar.showNotification('snackbar-danger', 'Report could not be generated');
      }
    });
  }

  getPayedFarmerAccruals(id){
    this.service.getFarmerAllocationAccruals(id, "Y").subscribe((res) => {
          this.payedAccruals = res.entity.accruedamount;

          if(res.entity.accruedamount != null){
            this.payedAccruals = res.entity.accruedamount;
          }else {
            this.payedAccruals = 0;
          }

          console.log("Payed Accruals", res)
        });    
  }

  getNonPayedFarmerAccruals(id){
    this.service.getFarmerAllocationAccruals(id, "N").subscribe((res) => {

      if(res.entity.accruedamount != null){
        this.notPayedAccruals = res.entity.accruedamount;
      }else {
        this.notPayedAccruals = 0;
      }
      
    });  
  }

  getFarmerAmountOnPayedCollections(id){
    this.service.getFarmerPayments(id, "Y").subscribe((res) => {

      if(res.entity != null){
        this.amountPayedOnCollections = res.entity;
      }else {
        this.amountPayedOnCollections = 0;
      }
      
    });  
  }

  getFarmerAmountOnNotPayedCollections(id){
    this.service.getFarmerPayments(id, "N").subscribe((res) => {

      if(res.entity != null){
        this.amountNotPayedOnCollections = res.entity;
      }else {
        this.amountNotPayedOnCollections = 0;
      }
      
    });  
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data?.length || 0;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  navigateBackToFarmers() {
    this.location.back();
  }

  applyAllocationFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allocationsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.allocationsDataSource.paginator) {
      this.allocationsDataSource.paginator.firstPage();
    }
  }
}