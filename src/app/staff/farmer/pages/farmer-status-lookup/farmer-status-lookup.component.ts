import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FarmerService } from '../../services/farmer.service';
import { NotificationService } from 'src/app/data/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BulkComponent } from 'src/app/staff/sms/bulk/bulk.component';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { filter } from 'rxjs';
import { SmsService } from 'src/app/staff/sms/sms.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FarmerData } from 'src/app/staff/sms/initiate-bulk-sms/initiate-bulk-sms.component';

@Component({
  selector: 'app-farmer-status-lookup',
  templateUrl: './farmer-status-lookup.component.html',
  styleUrls: ['./farmer-status-lookup.component.scss']
})
export class FarmerStatusLookupComponent implements OnInit {
  farmers: any[] = []
  dataSource: MatTableDataSource<any>
  routeId: number
  months: number
  locationId: number
  loading: boolean = false
  isdata: boolean = false
  templateForm: FormGroup
  filterForm: FormGroup
  templateFilterCtrl = new FormControl('')
  filteredTemplates: any[] = []
  templates: any[] = []
  filterSummary: any
  readonly: boolean = false
  selectedIndex: number = 0
  selectedFarmers: FarmerData[] = []
  selectedCount: number = 0

  selected = "";
  selection = new SelectionModel<any>(true, []);

  displayedColumns: string[] = [
    'select',
    'id',
    "username",
    "farmer_no",
    "mobile_no",
    "ID No.",
  ];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private smsService: SmsService,private fb: FormBuilder,private service: FarmerService, private snackbar: NotificationService, public dialogRef: MatDialogRef<BulkComponent>) { }

  ngOnInit(): void {
    this.templateForm = this.fb.group({
      template: [null, Validators.required],
      message: ['', Validators.required],
    });

    this.filterForm = this.fb.group({
      filter: ['all', Validators.required],
      location: [''],
      months: [1, [Validators.required, Validators.min(1)]],
    });

    this.getTemplates()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onStepChange(event: StepperSelectionEvent) {
    this.selectedIndex = event.selectedIndex
  }

  onTemplateChange(template: any) {
    console.log("template passed", template)
    this.readonly = true
    this.templateForm.patchValue({
      message: template.templateBody
    });
    this.templateForm.get('message')?.updateValueAndValidity();
    this.templateForm.get('template')?.updateValueAndValidity();
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
      } else {
        this.selection.select(...this.dataSource.data);
      }

      this.selectedCount = this.selection.selected.length;
    }

  getTemplates() {
    this.smsService.getAllTemplates().subscribe(
      (res) => {
        this.templates = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getFarmers(): void {
    if (this.filterForm.valid) {
      this.loading = true;
      this.months = this.filterForm.value.months;

      if (this.filterForm.value.filter === 'route') {
        this.getRouteActiveFarmers();
      } else if(this.filterForm.value.filter === 'center') {
        this.getCenterActiveFarmers();
      } else {
        this.getAllActiveFarmers()
      }

    }
  }

  mapSelectedFarmers() {
      this.selection.selected.forEach( (value) => {
        let farmer: FarmerData = new FarmerData();
        farmer.memberNumber = value.farmer_no;
        farmer.name = value.name;
        farmer.phoneNumber = value.mobile_no;
        farmer.idNumber = value.id_number;
        this.selectedFarmers.push(farmer);
      });
  }

  getLocationOptions() {
    return this.filterForm.value.filter === 'route'
      ? ['Route A', 'Route B']
      : ['Center X', 'Center Y'];
  }

   getAllActiveFarmers():void {
    this.loading = true

    this.service.getActiveFarmers(this.months).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers  =res.entity
          this.isdata = true
          this.dataSource = new MatTableDataSource(this.farmers)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        } else {
          this.snackbar.alertWarning("No active farmers found")
        }
      },
      error: (err) => {
        this.loading = false

        this.snackbar.alertWarning(err)
        console.error(err)
      },
      complete: () => {}
    })
  }


   getRouteActiveFarmers():void {
    this.loading = true

    this.service.getRouteActiveFarmers(this.filterForm.value.location, this.months).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers = res.entity
          this.dataSource  = new MatTableDataSource(this.farmers)
          this.dataSource.paginator = this.dataSource.paginator
          this.dataSource.sort = this.dataSource.sort
        } else {
          this.snackbar.alertWarning("No active farmers found")
        }
      },
      error: (err) => {
        this.loading = false

        this.snackbar.alertWarning(err)
        console.error(err)
      },
      complete: () => {}
    })
  }


   getCenterActiveFarmers():void {
    this.loading = true

    this.service.getCenterActiveFarmers(this.filterForm.value.location, this.months).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers = res.entity

          this.isdata = true
          this.dataSource = new MatTableDataSource(this.farmers)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        } else {
          this.snackbar.alertWarning("No active farmers found")
        }
      },
      error: (err) => {
        this.loading = false

        this.snackbar.alertWarning(err)
        console.error(err)
      },
      complete: () => {}
    })
  }

  sendMessage() {}

  close() {
    this.dialogRef.close();
  }

}
