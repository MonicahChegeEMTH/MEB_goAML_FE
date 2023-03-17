import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmerRoutingModule } from './farmer-routing.module';
import { FarmerManagenentComponent } from './pages/farmer-managenent/farmer-managenent.component';


@NgModule({
  declarations: [
    FarmerManagenentComponent
  ],
  imports: [
    CommonModule,
    FarmerRoutingModule
  ]
})
export class FarmerModule { }
