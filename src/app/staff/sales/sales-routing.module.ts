import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesManagenentComponent } from './pages/sales-managenent/sales-managenent.component';

const routes: Routes = [
  {
    path: "sales",
    component: SalesManagenentComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
