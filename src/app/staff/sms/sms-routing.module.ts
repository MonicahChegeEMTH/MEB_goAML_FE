import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmsManagementComponent } from './sms-management/sms-management.component';

const routes: Routes = [
  {
    path: "",
    component: SmsManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsRoutingModule { }
