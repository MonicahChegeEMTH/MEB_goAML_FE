import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  quantity: any = 0;
  amount: any = 0;
  departments: any = 0;
  subsidiaries: any = 0;
  meetingCategories: any = 0;
  actionTypes: any = 0;

  data: any;
  subscription!: Subscription;
  loaded: boolean = false;

  constructor(private service: DashboardService) {

  }

  getTodaysCollections() {
    this.subscription = this.service.getTodaysCollections().subscribe(res => {
      this.data = res;
      if (this.data) {
        console.log(this.data)
        this.loaded = true;
        this.quantity = this.data.entity[0].quantity;
        this.amount = this.data.entity[0].amount;
      
      }
    });
  }


  ngOnInit() {
    this.getTodaysCollections();
  }


}
