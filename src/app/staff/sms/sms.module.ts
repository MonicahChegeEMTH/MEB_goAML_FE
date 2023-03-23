import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsRoutingModule } from './sms-routing.module';
import { SmsManagementComponent } from './sms-management/sms-management.component';


@NgModule({
  declarations: [
    SmsManagementComponent
  ],
  imports: [
    CommonModule,
    SmsRoutingModule
  ]
})
export class SmsModule { }
