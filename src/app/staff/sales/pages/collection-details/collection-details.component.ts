import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReportsService } from 'src/app/reports/services/reports.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss'],
})
export class CollectionDetailsComponent implements OnInit {
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().slice(0, 10);

  displayedColumns: string[] = [
    'select',
    'quantity',
    'amount',
    'collector',
    // 'pickUpLocation',
    'collection_date',
    'paymentStatus',
  ];

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  farmerid: any;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog,
    private service: SalesService,
    private reportservice: ReportsService,
    private snackbar: SnackbarService
  ) {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('filter', { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  allocationsDataSource!: MatTableDataSource<any>;
  @ViewChild('allocationsPaginator', { static: false })
  allocationsPaginator!: MatPaginator;
  @ViewChild('allocationSort', { static: false }) collectorsSort!: MatSort;
  allocationsDisplayedColumns: string[] = [
    'id',
    'time',
    'product',
    'username',
    'amount',
    // 'revokeStatus',
    'paymentStatus',
    // 'allocatedBy',
    'quantity',
    'allocationDate',
  ];
  allocationsArray: any[] = [];
  allocationsNotAdded: boolean = true;
  allocationsIndex: any;
  updateCollectorsSelected: boolean = false;
  payedAccruals: number = 0;
  notPayedAccruals: number = 0;
  amountOnAllocatedItems: number = 0;
  totalAmountOnMilkDelivered: number = 0;
  amountPayedOnCollections: number = 0;
  amountNotPayedOnCollections: number = 0;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.farmerid = params['id'];
      // Use the id parameter in your component logic
    });

    this.getFarmerDetails(this.farmerid);
    this.getFarmerCollections(this.farmerid);
    this.getFarmerAllocations(this.farmerid);
    this.getPayedFarmerAccruals(this.farmerid);
    this.getNonPayedFarmerAccruals(this.farmerid);
    this.getFarmerAmountOnNotPayedCollections(this.farmerid);
    this.getFarmerAmountOnPayedCollections(this.farmerid)
  }

  farmer: any;
  present: boolean = false;
  found: boolean = false;
  selection = new SelectionModel<any>(true, []);

  getFarmerDetails(id) {
    this.service.getFarmerDetails(id).subscribe((res) => {
      this.farmer = res.entity;
      if (this.farmer.username != null || this.farmer.username != undefined) {
        this.present = true;
      } else {
        this.present = false;
      }
    });
  }

  getFarmerCollections(id) {
    this.isLoading = true;
    this.service.getFarmerCollections(id).subscribe((res) => {
      this.data = res;

      if (this.data.entity.length > 0) {
        this.isLoading = false;
        this.isdata = true;

      
        // Binding with the datasource
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.isdata = false;
        this.isLoading = false;
        // this.dataSource = new MatTableDataSource<any>(this.data);
      }
    });
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
    this.getFarmerAllocations(this.farmerid)
  }



  generateSTatement(farmerId: any) {
    this.reportservice.generatefarmerCollections(farmerId).subscribe(
      (response) => {
        console.log(response);
        let url = window.URL.createObjectURL(response.data);

        // if you want to open PDF in new tab
        window.open(url);

        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.setAttribute('target', 'blank');
        a.href = url;
        a.download = response.filename;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();

        this.isLoading = false;

        this.snackbar.showNotification(
          'Report generated successfully',
          'snackbar-success'
        );
      },
      (err) => {
        console.log(err);
        this.isLoading = false;

        this.snackbar.showNotification(
          'Report could not be generated successfully',
          'snackbar-danger'
        );
      }
    );
  }

  // accruals: any;
  // getAccruals() {
  //   this.service.getFarmerAccruals(this.farmerid).subscribe((res) => {
  //     this.accruals = res.entity;
  //     if (this.accruals != null) {
  //       this.found = true;
  //     }
  //   });
  // }

  getPayedFarmerAccruals(id){
    this.service.getFarmerAllocationAccruals(id, "Y").subscribe((res) => {
          this.payedAccruals = res.entity.accruedamount;

          if(res.entity.accruedamount != null){
            this.payedAccruals = res.entity.accruedamount;
          }else {
            this.payedAccruals = 0;
          }

          console.log("Payed Accruals", res)
          // if (this.accruals != null) {
          //   this.found = true;
          // }
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



  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  navigateBackToFarmers() {
    this.location.back();
  }

  applyAllocationFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.allocationsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.allocationsDataSource.paginator) {
      this.allocationsDataSource.paginator.firstPage();
    }
  }
}
