import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  collectionSummaryForm: FormGroup
  isloading: boolean

  date: any
  quantity: any = 0.0;
  amount: any = 0.0;
  farmers: any = 0
  count: any = 0


  data: any;
  subscription!: Subscription;
  loaded: boolean = false;
  userTasks: number
  userMeetings: number
  email: string
  closedTask: any
  openTask: any
  upcomingMeetings: any
  upcomingtasks: any;

  public cardChart2: any;
  public cardChart2Data: any;
  public cardChart2Label: any;

  constructor(
    private service: DashboardService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
   
  ) {

  }

  getAllColectionsSummary() {
    this.isloading = true
  
    this.subscription = this.service.getAllCollectionsRecords().subscribe(res => {
      this.data = res;
      if (this.data) {
        this.isloading = false
        console.log("All collections Summary"+ this.data.entity[0])
        this.isloading = true;
        this.quantity = this.data.entity[0].quantity;
        this.amount = this.data.entity[0].amount;
        this.count = this.data.entity[0].count
      }
    });


  }

  getAllFarmers() {
    this.subscription = this.service.getAllFarmers().subscribe(res => {
      this.data = res;
      if (this.data) {
        console.log(this.data)
        this.loaded = true;
        this.farmers = this.data.entity.length


      }
    });


  }



  ngOnInit() {
    this.collectionSummaryForm = this.fb.group(
      {
        date: ["", [Validators.required]],
      }
    )
    this.getAllColectionsSummary();
    this.getAllFarmers();
    this.smallChart2()
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
