import { Page404Component } from './../../authentication/page404/page404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { ReportHandlingComponent } from './report-handling/report-handling.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'reports',
    pathMatch: 'full',
  },
  
  {
    path: 'reports',
    component: ReportsComponent,
  },

  {
    path: 'reports-handling',
    component: ReportHandlingComponent,
  },

  { 
    path: '**', 
    component: Page404Component 
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
