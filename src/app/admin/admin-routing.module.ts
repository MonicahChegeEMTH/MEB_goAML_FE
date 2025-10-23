import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.AdminDashboardModule),
  },

  {
    path: "reports",
    loadChildren: () =>
      import("./reports/reports.module").then((m) => m.ReportsModule),
  },

  {
    path: "logs",
    loadChildren: () =>
      import("./logs/logs.module").then((m) => m.LogsModule),
  },

  {
    path: "user-profile",
    loadChildren: () =>
      import("./users/users.module").then(
        (m) => m.UsersModule
      ),
  },
  {
    path: "user-accounts",
    loadChildren: () => import("./users/users.module").then((m) => m.UsersModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AdminRoutingModule { }
