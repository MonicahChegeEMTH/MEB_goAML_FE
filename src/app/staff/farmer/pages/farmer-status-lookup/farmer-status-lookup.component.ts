import { Component, OnInit } from '@angular/core';
import { FarmerService } from '../../services/farmer.service';
import { NotificationService } from 'src/app/data/services/notification.service';

@Component({
  selector: 'app-farmer-status-lookup',
  templateUrl: './farmer-status-lookup.component.html',
  styleUrls: ['./farmer-status-lookup.component.sass']
})
export class FarmerStatusLookupComponent implements OnInit {

  constructor(private service: FarmerService, private snackbar: NotificationService) { }
  farmers: any[] = []
  routeId: number
  months: number
  locationId: number
  loading: boolean = false

  ngOnInit(): void {

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
