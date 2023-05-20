import { AgmMap } from '@agm/core';
import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import { DashboardService } from 'src/app/staff/dashboard/services/dashboard.service';
import { EditCollectionComponent } from '../edit-collection/edit-collection.component';
import { LookupPickUpLocationsComponent } from '../lookup-pick-up-locations/lookup-pick-up-locations.component';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { RoutesLookUpComponent } from '../routes-look-up/routes-look-up.component';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  filterform: FormGroup
  today: Date = new Date();
  formattedDate: string = this.today.toISOString().slice(0, 10);
  date: any;
  fromDate: any;
  toDate: any;
  form: FormGroup;
  mapForm: FormGroup;
  selected = "";
  selectedvalue = "";
  count: any = 0
  dcount: any = 0
  dquantity: any = 0.0;
  damount: any = 0.0;
  farmers: any = 0
  datasize:any=0
  farmer: any
  filename = "collections for " + this.today;

  public cardChart2: any;
  public cardChart2Data: any;
  public cardChart2Label: any;

  @ViewChild('map') map: AgmMap;
  ngAfterViewInit() {
    this.map.fitBounds == true;
  }

  collectors: any;
  latitude = 0.1768696;
  longitude = 37.9083264;
  zoom = 8;
  markers: any;
  restriction = {
    latLngBounds: {
      east: 37.995213, // Longitude of the east border of UK
      north: 0.4667, // Latitude of the north border of UK
      south: -4.181611, // Latitude of the south border of UK
      west: 34.287807 // Longitude of the west border of UK
    },
    strictBounds: true
  };


  displayedColumns: string[] = [
    'id',
    "farmer_no",
    'farmer',
    "quantity",
    "session",
    "collection_date",
    "route",
    "pickUpLocation",
    'action',
  ];

  currentDate: any

  subscription!: Subscription;
  data: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  constructor(
    // public dialogRef: MatDialogRef<MainComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router, private datePipe: DatePipe, private fb: FormBuilder, private dialog: MatDialog, private service: SalesService, private dashboard: DashboardService,
    private snackbar: SnackbarService) {
    this.currentDate = this.getCurrentDate()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCurrentDate(): any {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  onSelectionChange() {
    switch (this.selected) {
      case 'current_date':
        this.getTodaysData()
        break;
        case 'all':
          this.getData()
      default:
        break;

    }
  }

  filterByDate() {
    if (this.selected == 'dr') {
      this.fromDate = this.datePipe.transform(this.form.value.fromDate, 'yyyy-MM-dd');
      this.toDate = this.datePipe.transform(this.form.value.toDate, 'yyyy-MM-dd');
      if (this.fromDate != null && this.fromDate != undefined && this.toDate != null && this.toDate != undefined) {
        this.isLoading = true;
        this.getDateRangeSummary(this.fromDate,this.toDate)
        this.subscription = this.service.getCollectionsDateRange(this.fromDate, this.toDate).subscribe(res => {
          this.data = res;
          if (this.data.entity.length > 0) {
            this.isLoading = false;
            this.isdata = true;
            // Binding with the datasource
            this.datasize=this.data.entity.length
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
    else if (this.selected == 'sd') {
      this.date = this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd');
      this.isLoading = true;
      this.getDateSummary(this.date)
      this.subscription = this.service.getCollections(this.date).subscribe(res => {
        this.data = res;
        if (this.data.entity.length > 0) {
          this.isLoading = false;
          this.isdata = true;
          // Binding with the datasource
          this.datasize=this.data.entity.length
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
    } else if (this.selected == 'pul') {
      console.log("Filter by  pick up location")


    } else if (this.selected == "route") {
      console.log("Filter by  route")



    }
    else if (this.selected == "current_date") {
      this.getTodaysData()
    }
    else if (this.selected == "all") {
      this.getData();
    }
  }


  colData: any;
  getMilkCollectors() {
    this.subscription = this.service.getAllCollectors().subscribe(res => {
      this.colData = res;
      if (this.colData.entity.length > 0) {
        this.collectors = this.colData.entity;
      }
      else {
        this.collectors = [];
      }
    })
  }

  locations: any;
  isCoordinates: boolean = false;
  getCoordinates() {
    this.subscription = this.service.getCollectorLocationsByDate(this.mapForm.value.collectorId, this.datePipe.transform(this.mapForm.value.date, 'yyyy-MM-dd')).subscribe(res => {
      this.locations = res;
      console.log(this.locations)
      if (this.locations.entity.length > 0) {
        this.isCoordinates = true;
        this.markers = this.locations.entity;
      }
      else {
        this.markers = [];
      }
    })
  }


  getData() {
    // this.selected = "all";
    this.isLoading = true;
    this.getAllColectionsSummary()
    this.subscription = this.service.getAllCollections().subscribe(res => {
      this.data = res;
      if (this.data.entity.length > 0) {
        console.log(this.data.entity)
        this.isLoading = false;
        this.isdata = true;
        // Binding with the datasource
        this.datasize=this.data.entity.length
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

  getTodaysData() {
    this.isLoading = true;
     this.getDateSummary(this.currentDate)
      this.subscription = this.service.getTodaysCollections(this.currentDate).subscribe(res => {
      this.data = res;
      if (this.data.entity.length > 0) {
        console.log(this.data.entity)
        this.isLoading = false;
        this.isdata = true;
        // Binding with the datasource
        this.datasize=this.data.entity.length
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.isdata = false;
        this.isLoading = false
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
    this.selected = 'current_date'
    this.getAllFarmers();
    this.smallChart2()
    this.getTodaysData();
    this.getMilkCollectors();
    this.form = this.fb.group({
      date: [""],
      fromDate: [""],
      toDate: [""],
      pickuplocation: [""],
      pickuplocationId: [""],
      route: [""],
      routeId: [""],
      farmer_no: [""]
    });

    this.mapForm = this.fb.group({
      collectorId: ["", [Validators.required]],
      date: ["", [Validators.required]],
    });

    console.log("The current date is", this.currentDate)
  }

  viewFarmerCollections(row) {
    this.router.navigate(['/staff/sales/farmer', row.farmerId]);
  }
  getDateSummary(date) {
    this.isLoading = true
    // this.date = this.datePipe.transform(this.form.value.date, 'yyyy-MM-dd');
    console.log("Formated date is ", date)
    this.subscription = this.dashboard.getDateCollections(date).subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isLoading = false
        console.log(this.data)
        this.isLoading = true;
        this.dquantity = this.data.entity[0].quantity;
        this.damount = this.data.entity[0].amount;
        this.dcount = this.data.entity[0].count
      }
    });


  }
  getDateRangeSummary(from,to) {
    this.isLoading = true
  
    this.subscription = this.dashboard.getDateDangeCollections(from,to).subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isLoading = false
        console.log(this.data)
        this.isLoading = true;
        this.dquantity = this.data.entity[0].quantity;
        this.damount = this.data.entity[0].amount;
        this.dcount = this.data.entity[0].count
      }
    });


  }
  getSummaryPerPickUpLocatins(pickUpLocationId) {
    this.isLoading = true
  
    this.subscription = this.dashboard.getPickUpLocationCollections(pickUpLocationId).subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isLoading = false
        console.log(this.data)
        this.isLoading = true;
        this.dquantity = this.data.entity[0].quantity;
        this.damount = this.data.entity[0].amount;
        this.dcount = this.data.entity[0].count
      }
    });


  }
  getSummaryPerRoute(routeId) {
    this.isLoading = true
  console.log("Route id"+ routeId)
    this.subscription = this.dashboard.getRouteCollections(routeId).subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isLoading = false
        console.log("Route collection summary",this.data)
        this.isLoading = true;
        this.dquantity = this.data.entity[0].quantity;
        this.damount = this.data.entity[0].amount;
        this.dcount = this.data.entity[0].count
      }
    });


  }
  getAllColectionsSummary() {
    this.isLoading = true
  
    this.subscription = this.dashboard.getAllCollectionsRecords().subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isLoading = false
        console.log(this.data)
        this.isLoading = true;
        this.dquantity = this.data.entity[0].quantity;
        this.damount = this.data.entity[0].amount;
        this.dcount = this.data.entity[0].count
      }
    });


  }

  getAllFarmers() {
    this.subscription = this.service.getAllFarmers().subscribe(res => {
      this.data = res;
      if (this.data) {
        console.log(this.data)
        this.isLoading = false
        this.farmers = this.data.entity.length


      }
    });


  }


  dialogData: any;



  selectpickUpLocation() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      data: "",
    };
    const dialogRef = this.dialog.open(LookupPickUpLocationsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result)
      this.dialogData = result;

      this.form.patchValue({
        pickuplocation: this.dialogData.data.name,
        pickuplocationId: this.dialogData.data.id
      });
      let pid = this.form.value.pickuplocationId
      this.filterByPickUpLoction(pid)
      

    });
  }
  selectRoute() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      data: "",
    };
    const dialogRef = this.dialog.open(RoutesLookUpComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      console.log("Routes", result)
      this.dialogData = result;
      this.form.patchValue({
        route: this.dialogData.data.route,
        routeId: this.dialogData.data.id
      });
      let rid = this.form.value.routeId
      this.filterByRoute(rid)

    });
  }
  filterByPickUpLoction(id: any) {
    this.isLoading = true;
    this.getSummaryPerPickUpLocatins(id)

    // let pickUpLocationId = this.form.value.pickUpLocationId
    console.log("Passed Id is ", id)

    this.subscription = this.service.getCollectionsPerPickUpLocation(id).subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isdata = true
        console.log(this.data)
        this.isLoading = false;
        this.datasize=this.data.entity.length
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.isdata = false;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(null);
      }
    })
  }
  filterByFarmerNo(id: any) {
    this.isLoading = true;
    let farmerNo = this.form.value.farmer_no
    console.log(this.form.value.farmer_no)

    if (farmerNo != null && farmerNo != undefined) {

      // this.subscription = this.service.getCollectionsByFarmerNo(farmerNo).subscribe(res => {
      //   this.data = res;
      //   console.log(this.data.entity)
      //   if (this.data.entity!=null) {
      //     let result = []
      //     result.push(this.data.entity)

      //     this.isLoading = false;
      //     this.isdata = true;
      //     // Binding with the datasource
      //     this.dataSource = new MatTableDataSource(result);
      //     this.dataSource.paginator = this.paginator;
      //     this.dataSource.sort = this.sort;
      //   }
      //   else {
      //     this.isdata = false;
      //     this.isLoading = false;
      //     this.dataSource = new MatTableDataSource(null);
      //   }
      // })
      this.subscription = this.service.getCollectionsByFarmerNo(farmerNo).subscribe(res => {
        this.data = res;
        if (this.data) {
          this.isLoading = false
          console.log(this.data.entity.size > 0)
          this.isdata = true;
          this.datasize=this.data.entity.length
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
  filterByRoute(id: any) {
    this.isLoading = true;
    this.getSummaryPerRoute(id)

    // let pickUpLocationId = this.form.value.pickUpLocationId
    console.log("Passed ROute Id is ", id)

    this.subscription = this.service.getCollectionsPerPRoute(id).subscribe(res => {
      this.data = res;
      if (this.data.entity.length > 0) {
        this.isLoading = false
        console.log("Route collections"+ this.data)
        this.isdata = true;
        this.datasize=this.data.entity.length
        this.dataSource = new MatTableDataSource(this.data.entity);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      else {
        this.isdata = false;
        this.isLoading = false
        this.dataSource = new MatTableDataSource(null);
      }
    })
  }


  edit(collection) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "60%"
    dialogConfig.data = {
      collection: collection
    }
    this.dialog.open(EditCollectionComponent, dialogConfig)
  }
  private smallChart2() {
    this.cardChart2 = {
      responsive: true,
      tooltips: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            gridLines: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              beginAtZero: true,
              display: false,
            },
          },
        ],
        xAxes: [
          {
            gridLines: {
              drawBorder: false,
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
      },
      title: {
        display: false,
      },
    };
    this.cardChart2Data = [
      {
        label: "New Clients",
        data: [50, 61, 80, 50, 40, 93, 63, 50, 62, 72, 52, 60, 41, 30, 45, 70],
        borderWidth: 4,
        pointStyle: "circle",
        pointRadius: 4,
        borderColor: "rgba(253,126,20,.7)",
        pointBackgroundColor: "rgba(253,126,20,.2)",
        backgroundColor: "rgba(253,126,20,.2)",
        pointBorderColor: "transparent",
      },
    ];
    this.cardChart2Label = [
      "16-07-2018",
      "17-07-2018",
      "18-07-2018",
      "19-07-2018",
      "20-07-2018",
      "21-07-2018",
      "22-07-2018",
      "23-07-2018",
      "24-07-2018",
      "25-07-2018",
      "26-07-2018",
      "27-07-2018",
      "28-07-2018",
      "29-07-2018",
      "30-07-2018",
      "31-07-2018",
    ];
  }
}
