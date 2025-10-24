import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.AuditorDashboardModule),
  },
  {
    path: "reports",
    loadChildren: () => import("./reports/reports.module").then((m) => m.ReportsModule)
  },
  {
    path: "logs",
    loadChildren: () => import("./logs/logs.module").then((m) => m.LogsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AuditorRoutingModule { }
