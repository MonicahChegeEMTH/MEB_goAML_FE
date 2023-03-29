import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTooltip,
  ApexDataLabels,
  ApexLegend,
  ApexResponsive,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexGrid,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { takeUntil } from 'rxjs';
import { AnalyticsService } from 'src/app/data/services/analytics.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  colors: string[];
  labels: string[];
  markers: ApexMarkers;
  grid: ApexGrid;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-collector-collections-in-quantity-per-session',
  templateUrl: './collector-collections-in-quantity-per-session.component.html',
  styleUrls: ['./collector-collections-in-quantity-per-session.component.sass'],
})
export class CollectorCollectionsInQuantityPerSessionComponent extends BaseComponent
  implements OnInit
{
  public barChartOptions: Partial<ChartOptions>;

  chartDispType: any = ["Year-wise", "Month-wise"];
  monthsArray: any = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "Novembar",
    "December",
  ];

  isLoading: boolean = true;
  chartParametersForm: FormGroup;
  needYear = false;
  needMonth = false;
  poneedYear = false;
  poneedMonth = false;
  month: any;
  currentYear = new Date().getFullYear();
  currentMonth = this.monthsArray[new Date().getMonth()];
  currentEmail: any;
  currentMeeting: any;
  years: Object;
  meetingYears: any[] = [];
  year: any;

  meetings: any[] = [];
  meetingsExist: boolean = false;
  meetingTitle: string

  public doughnutChartLabels: string[] = ["Session 1", "Session 2", "Session 3"];
  public doughnutChartData: number[] = [];
  public doughnutChartLegend = false;
  public doughnutChartColors: any[] = [
    {
      backgroundColor: ["#2D7152", "#4F7161", "#66716C", "#22714D"],
    },
  ];
  public doughnutChartType = "doughnut";
  public doughnutChartOptions: any = {
    animation: false,
    responsive: true,
  };

  sessionOne:number = 0;
  sessionTwo: number = 0;
  sessionThree: number = 0;
  
  constructor(
    private analyticsService: AnalyticsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getCollectorSessionData();

  }

  getCollectorSessionData() {
    this.isLoading = true;

    let sessionOne: any[] = [];
    let sessionTwo: any[] = [];
    let sessionThree: any[] = [];

    // this.currentMeeting = this.chartParametersForm.controls.meetingid.value;

    let params = new HttpParams()
    .set("year", 2023)
    .set("month", 3)
    .set("collectorId", 4)

    this.analyticsService
      .getCollectorSessionData(params)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          console.log("RESPONCE ", res)
          this.doughnutChartData = [];

          res.entity.forEach((item) => {

            if(item.session == "Session 1"){
              sessionOne.push(item.quantity)
              
              this.sessionOne = parseInt(sessionOne[0]);

              console.log("SESSION ONE ", this.sessionOne);

              this.doughnutChartData.push(this.sessionOne);
            }

            if(item.session == "Session 2"){
              sessionTwo.push(item.quantity);
             
              this.sessionTwo = parseInt(sessionTwo[0]);

              console.log("SESSION TWO ", this.sessionTwo)

              this.doughnutChartData.push(this.sessionTwo);
            }


            if(item.session == "Session 3"){
              sessionThree.push(item.quantity);

              this.sessionThree = parseInt(sessionThree[0]);

              console.log("SESSION THREE ", this.sessionThree);

              this.doughnutChartData.push(this.sessionThree);
            }
          });

          console.log("DOUGHNUT CHAT ", this.doughnutChartData)

          this.isLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
