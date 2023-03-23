import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.sass']
})
export class CollectionsComponent implements OnInit {
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().slice(0, 10);
  date: any;
  fromDate: any;
  toDate: any;
  form: FormGroup;
  selected = "";

  displayedColumns: string[] = [
    'id',
    "farmer",
    "quantity",
    "amount",
    "collector",
    "collection_date",
    "paymentStatus",
    'action',
  ];

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  constructor(private router: Router, private datePipe: DatePipe, private fb: FormBuilder, private dialog: MatDialog, private service: SalesService,) { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterByDate() {
    if (this.selected == 'dr') {
      this.fromDate = this.datePipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
      if (this.fromDate != null && this.fromDate != undefined && this.toDate != null && this.toDate != undefined) {
        this.isLoading = true;
        this.subscription = this.service.getCollectionsDateRange(this.fromDate,this.toDate).subscribe(res => {
          this.data = res;
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
            this.isLoading = false;
            this.dataSource = new MatTableDataSource(null);
          }
        })
      }
    }
    else if(this.selected == 'sd'){
      this.date = this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd');
      this.isLoading = true;
      this.subscription = this.service.getCollections(this.date).subscribe(res => {
        this.data = res;
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
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(null);
        }
      })
    }
    else{
      this.getData();
    }
  }


  getData() {
    this.selected = "";
    this.isLoading = true;
    this.subscription = this.service.getAllCollections().subscribe(res => {
      this.data = res;
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
        this.dataSource = new MatTableDataSource(null);
      }
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
    this.getData();
    this.form = this.fb.group({
      date: [""],
      fromDate: [""],
      toDate: [""],
    })
  }

  viewFarmerCollections(row) {
    this.router.navigate(['/staff/sales/farmer', row.farmerId]);
  }
}
