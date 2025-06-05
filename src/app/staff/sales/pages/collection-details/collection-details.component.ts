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
    'collection_date',
    'paymentStatus',
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
    console.log('Fetching today\'s collections for:', this.farmerNo, 'on', this.formattedDate);
    this.service.filterCollections(this.farmerNo, this.formattedDate, this.formattedDate)
      .subscribe((res: ApiResponse<Collection[]>) => {
        console.log('Today\'s collections response:', res);
        const collections = res.entity || [];
        this.isdata = collections.length > 0;
        this.quantity = collections.reduce((sum, col) => sum + col.quantity, 0);
        this.dataSource = new MatTableDataSource(collections);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
        console.log('Collections loaded. Total quantity:', this.quantity);
      });
  }

  filterCollections(): void {
    if (this.form.valid) {
      const from = this.datePipe.transform(this.form.value.from, 'yyyy-MM-dd')!;
      const to = this.datePipe.transform(this.form.value.to, 'yyyy-MM-dd')!;
      console.log('Filtering collections from', from, 'to', to);
      this.isLoading = true;
      this.service.filterCollections(this.farmerNo, from, to)
        .subscribe((res: ApiResponse<Collection[]>) => {
          console.log('Filtered collections response:', res);
          const collections = res.entity || [];
          this.isdata = collections.length > 0;
          this.quantity = collections.reduce((sum, col) => sum + col.quantity, 0);
          this.dataSource = new MatTableDataSource(collections);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        });
    } else {
      this.snackbar.showNotification('snackbar-danger', 'From and To dates are required');
    }
  }
  filterByDateRange(): void {
  if (!this.startDate && !this.endDate) {
    this.allocationsArray = [...this.originalAllocations];
  } else {
    this.allocationsArray = this.originalAllocations.filter(a => {
      const approval = new Date(new Date(a.approvalDate).toDateString());
      const start = this.startDate ? new Date(this.startDate) : null;
      const end = this.endDate ? new Date(this.endDate) : null;
      if (start && end) return approval >= start && approval <= end;
      if (start) return approval >= start;
      if (end) return approval <= end;
      return true;
    });
  }

  this.allocationsDataSource = new MatTableDataSource(this.allocationsArray);
  this.allocationsDataSource.paginator = this.allocationsPaginator;
  this.allocationsDataSource.sort = this.collectorsSort;
}

  getFarmerAllocations(farmerNo: string): void {
    console.log('Fetching allocations for:', farmerNo);
    this.service.getFarmerAllocations(farmerNo).subscribe((res: ApiResponse<Allocation[]>) => {
      console.log('Allocations response:', res); // Log entire response
      this.allocationsArray = res.entity || [];
        this.originalAllocations = [...this.allocationsArray];
      console.log('Parsed allocations:', this.allocationsArray); // Log parsed data

      this.allocationsNotAdded = this.allocationsArray.length === 0;
      this.amountOnAllocatedItems = this.allocationsArray.reduce((sum, a) => sum + a.amount, 0);
      this.allocationsDataSource = new MatTableDataSource(this.allocationsArray);
      this.allocationsDataSource.paginator = this.allocationsPaginator;
      this.allocationsDataSource.sort = this.collectorsSort;
      console.log('Allocations loaded. Count:', this.allocationsArray.length);
    });
  }

refreshAllocations(): void {
    this.startDate = '';
    this.endDate = '';
    const input: HTMLInputElement | null = document.querySelector('.search-field');
    if (input) input.value = '';
    this.allocationsArray = [...this.originalAllocations];
    this.allocationsDataSource = new MatTableDataSource(this.allocationsArray);
    this.allocationsDataSource.paginator = this.allocationsPaginator;
    this.allocationsDataSource.sort = this.collectorsSort;
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

  getPayedFarmerAccruals(farmerNo: string): void {
    console.log('Fetching payed accruals...');
    this.service.getFarmerAllocationAccruals(farmerNo, "Y").subscribe((res: ApiResponse<{ accruedamount: number }>) => {
      console.log('Payed accruals:', res);
      this.payedAccruals = res.entity?.accruedamount || 0;
    });
  }

  getNonPayedFarmerAccruals(farmerNo: string): void {
    console.log('Fetching unpaid accruals...');
    this.service.getFarmerAllocationAccruals(farmerNo, "N").subscribe((res: ApiResponse<{ accruedamount: number }>) => {
      console.log('Unpaid accruals:', res);
      this.notPayedAccruals = res.entity?.accruedamount || 0;
    });
  }

  getFarmerAmountOnPayedCollections(farmerNo: string): void {
    console.log('Fetching payed collection amount...');
    this.service.getFarmerPayments(farmerNo, "Y").subscribe((res: ApiResponse<number>) => {
      console.log('Payed collection amount:', res);
      this.amountPayedOnCollections = res.entity || 0;
    });
  }

  getFarmerAmountOnNotPayedCollections(farmerNo: string): void {
    console.log('Fetching not-payed collection amount...');
    this.service.getFarmerPayments(farmerNo, "N").subscribe((res: ApiResponse<number>) => {
      console.log('Not payed collection amount:', res);
      this.amountNotPayedOnCollections = res.entity || 0;
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
