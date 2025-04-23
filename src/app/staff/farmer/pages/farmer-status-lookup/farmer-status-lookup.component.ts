import { Component, Inject, OnInit } from '@angular/core';
import { FarmerService } from '../../services/farmer.service';
import { NotificationService } from 'src/app/data/services/notification.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BulkComponent } from 'src/app/staff/sms/bulk/bulk.component';

@Component({
  selector: 'app-farmer-status-lookup',
  templateUrl: './farmer-status-lookup.component.html',
  styleUrls: ['./farmer-status-lookup.component.sass']
})
export class FarmerStatusLookupComponent implements OnInit {
  farmers: any[] = []
  dataSource: MatTableDataSource<any>
  routeId: number
  months: number
  locationId: number
  loading: boolean = false
  isdata: boolean = false

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private service: FarmerService, private snackbar: NotificationService, private dialogRef: MatDialogRef<BulkComponent>) { }

  ngOnInit(): void {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private getAllActiveFarmers():void {
    this.loading = true

    this.service.getActiveFarmers().subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers = res.entity
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


  private getRouteActiveFarmers(routeId: number, months: any):void {
    this.loading = true

    this.service.getRouteActiveFarmers(routeId, months).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers = res.entity
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


  private getCenterActiveFarmers(locationId: number, months: number):void {
    this.loading = true

    this.service.getCenterActiveFarmers(locationId, months).subscribe({
      next: (res) => {
        this.loading = false;

        if (res.entity.length > 0) {
          this.farmers = res.entity
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

}
