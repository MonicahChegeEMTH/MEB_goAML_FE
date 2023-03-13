import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/core/guard/auth.guard';
import { SystemrolesComponent } from './systemroles/systemroles.component';
import { Page404Component } from 'src/app/authentication/page404/page404.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    component: SystemrolesComponent,
  },
  { 
    path: "**", component: Page404Component 
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),

  ],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
