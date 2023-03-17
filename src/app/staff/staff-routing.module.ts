import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
    import("./dashboard/dashboard.module").then((m)=>m.DashboardModule)
  },
  {
    path: "farmers",
    loadChildren: () =>
    import("./farmer/farmer.module").then((m)=>m.FarmerModule)
  },
  {
    path: "sales",
    loadChildren: () =>
    import("./sales/sales.module").then((m)=>m.SalesModule)
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffRoutingModule { }
