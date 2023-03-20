import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../services/sales.service';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.sass']
})
export class CollectionDetailsComponent implements OnInit {

  today: Date = new Date();
  formattedDate: string = this.today.toISOString().slice(0,10); 

  displayedColumns: string[] = [
    'id',
    "farmer",
    "quantity",    
    "amount",
    "collector",
    "pickUpLocation",
    "collection_date",
    "paymentStatus",
    'action',
  ];

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  farmerid:any
  constructor(private route: ActivatedRoute, private dialog: MatDialog, private service: SalesService,) { }

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
    console.log("New date fromat is ",this.formattedDate)
    this.route.params.subscribe((params: Params) => {
      this.farmerid = params['id'];
      // Use the id parameter in your component logic
    });
   
    this.getFarmerCollections(this.farmerid)

  }



  // getFarmerDetails(id){
  //   this.service.
    
  // }
  getFarmerCollections(id){
    this.service.getFarmerCollections(id).subscribe(res=>{
      this.data=res
      console.log("Farmer colections",this.data.entity)
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



  editCountyCall(County) {
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = false
    // dialogConfig.autoFocus = true
    // dialogConfig.width = "500px"
    // dialogConfig.data = {
    //   county: County
    // }
    // this.dialog.open(EditCountyComponent, dialogConfig)
  }


}
