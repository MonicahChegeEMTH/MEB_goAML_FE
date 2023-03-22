import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './templates/main/main.component';
import { CollectionsPerCollectorComponent } from './collections-per-collector/collections-per-collector.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FarmersPerPickupLocationComponent } from './farmers-per-pickup-location/farmers-per-pickup-location.component';
import { PickupLocationsPerWardComponent } from './pickup-locations-per-ward/pickup-locations-per-ward.component';
import { MilkCollectionsPerWardComponent } from './milk-collections-per-ward/milk-collections-per-ward.component';


@NgModule({
  declarations: [
    MainComponent,
    CollectionsPerCollectorComponent,
    FarmersPerPickupLocationComponent,
    PickupLocationsPerWardComponent,
    MilkCollectionsPerWardComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
