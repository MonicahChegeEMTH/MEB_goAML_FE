import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {

  users: any = 0;
  teams: any = 0;
  departments: any = 0;
  subsidiaries: any = 0;
  meetingCategories: any = 0;
  actionTypes: any = 0;

  data: any;
  subscription!: Subscription;
  loaded: boolean = false;

  constructor(private service: DashboardService) {

  }

  getAnalysis() {
    // this.subscription = this.service.getDashboardWigetsAnalytics().subscribe(res => {
    //   this.data = res;
    //   if (this.data) {
    //     this.loaded = true;
    //     this.users = this.data.entity.users;
    //     this.teams = this.data.entity.teams;
    //     this.meetingCategories = this.data.entity.meetingCategeories;
    //     this.departments = this.data.entity.departments;
    //     this.actionTypes = this.data.entity.actionTypes;
    //     this.subsidiaries = this.data.entity.subsidiaries;
    //   }
    // });
  }


  ngOnInit() {
    this.getAnalysis();
  }


}
