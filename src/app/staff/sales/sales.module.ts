import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesManagenentComponent } from './pages/sales-managenent/sales-managenent.component';


@NgModule({
  declarations: [
    SalesManagenentComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
