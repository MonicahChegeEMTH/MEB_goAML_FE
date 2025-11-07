import { Page404Component } from "./../../authentication/page404/page404.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LogsComponent } from "./logs/logs.component";
const routes: Routes = [
  {
    path: "",
    redirectTo: "logs",
    pathMatch: "full",
  },
  
  {
    path: "logs",
    component: LogsComponent,
  },

  { 
    path: "**", 
    component: Page404Component 
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogsRoutingModule {}
