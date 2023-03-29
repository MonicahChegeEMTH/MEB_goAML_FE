import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  selector: 'app-collector-collections-count',
  templateUrl: './collector-collections-count.component.html',
  styleUrls: ['./collector-collections-count.component.sass'],
})
export class CollectorCollectionsCountComponent
  extends BaseComponent
  implements OnInit
{
  public barChartOptions: Partial<ChartOptions>;
  public lineChartOptions: Partial<ChartOptions>;

  chartDispType: any = ['Year-wise', 'Month-wise'];
  monthsArray: any = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'Novembar', value: 11 },
    { name: 'December', value: 12 },
  ];
  isLoading: boolean;
  currentYear = new Date().getFullYear();
  currentMonth = this.monthsArray[new Date().getMonth()];

  constructor(private analyticsService: AnalyticsService) {
    super();
  }

  ngOnInit(): void {
    this.getCollectorCountPerMonth();
  }

  getCollectorCountPerMonth() {
    this.isLoading = true;

    let months: any[] = [];
    let collections: any[] = [];
    let params;

    params = new HttpParams()
      .set('year', this.currentYear)
      .set('collectorId', 4);

    this.analyticsService
      .getCollectorCountPerMonth(params)
      .pipe(takeUntil(this.subject))
      .subscribe(
        (res) => {
          console.log('Response', res);

          res.entity.forEach((item) => {
            months.push(item.month);

            collections.push(item.colectionsCount);
          });

          this.lineChartOptions = {
            series: [
              {
                name: 'Collections Count',
                data: collections,
              },
            ],
            chart: {
              height: 350,
              type: 'line',
              foreColor: '#9aa0ac',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2,
              },
              toolbar: {
                show: false,
              },
            },
            colors: ['#177147', '#397157', '#2D7152', '#22714D'],
            stroke: {
              curve: 'smooth',
            },
            grid: {
              row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            markers: {
              size: 3,
            },
            xaxis: {
              categories: months,
              title: {
                text: 'Months',
              },
            },
            yaxis: {
              // opposite: true,
              title: {
                text: 'Collections Count',
              },
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
              floating: true,
              offsetY: -25,
              offsetX: -5,
            },
            tooltip: {
              theme: 'dark',
              marker: {
                show: true,
              },
              x: {
                show: true,
              },
            },
          };

          this.isLoading = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
