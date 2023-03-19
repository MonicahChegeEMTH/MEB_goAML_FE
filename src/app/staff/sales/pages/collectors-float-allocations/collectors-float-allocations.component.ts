import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import { FloatAllocationComponent } from '../float-allocation/float-allocation.component';

@Component({
  selector: 'app-collectors-float-allocations',
  templateUrl: './collectors-float-allocations.component.html',
  styleUrls: ['./collectors-float-allocations.component.sass']
})
export class CollectorsFloatAllocationsComponent implements OnInit {


  displayedColumns: string[] = [
    'id',
    "collector",
    'floatAmount',
    "balance",
    "allocatedBy",
    'date',
    'action',
  ];

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading:boolean = false;
  constructor(private router: Router, private dialog: MatDialog, private service: SalesService,) { }

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
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.isLoading = true;
   this.service.getCollectorAllocations().subscribe(res => {
      this.data = res;
      console.log("Allocations",this.data.entity)
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
    })
  }

  addCountyCall() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "70%"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(FloatAllocationComponent, dialogConfig)
  }

  editCountyCall(row) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false
    // dialogConfig.autoFocus = true
    // dialogConfig.width = "500px"
    // dialogConfig.data = {
    //   county: County
    // }
    // this.dialog.open(EditCountyComponent, dialogConfig)
  }

  // deleteCountyCall(County) {
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = false
  //   dialogConfig.autoFocus = true
  //   dialogConfig.width = "500px"
  //   dialogConfig.data = {
  //     county: County
  //   }
  //   this.dialog.open(DeleteCountyComponent, dialogConfig)
  // }
}