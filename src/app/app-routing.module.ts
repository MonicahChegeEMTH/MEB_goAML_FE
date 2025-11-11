import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { Page404Component } from "./authentication/page404/page404.component";
import { AuthGuard } from "./core/guard/auth.guard";
import { Role } from "./core/models/role";
import { AuthLayoutComponent } from "./layout/app-layout/auth-layout/auth-layout.component";
import { MainLayoutComponent } from "./layout/app-layout/main-layout/main-layout.component";
const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
      {
        path: "admin",
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] },
        loadChildren: () =>
          import("./admin/admin.module").then((m) => m.AdminModule),
      },
      {
        path: "auditor",
        canActivate: [AuthGuard],
        data: {
          role: Role.Auditor,
        },
        loadChildren: () =>
          import("./auditor/auditor.module").then((m) => m.AuditorModule),
      },
      {
        path: "riskofficer",
        canActivate: [AuthGuard],
        data: {
          role: Role.Riskofficer,
        },
        loadChildren: () =>
          import("./riskofficer/riskofficer.module").then((m) => m.RiskofficerModule),
      },
      { path: "", redirectTo: "/authentication/signin", pathMatch: "full" },
     
    ],
  },
  {
    path: "authentication",
    component: AuthLayoutComponent,
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
  { path: "**", component: Page404Component },
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false, relativeLinkResolution: "legacy"})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
