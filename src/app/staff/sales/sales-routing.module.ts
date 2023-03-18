import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CollectionsComponent } from './pages/collections/collections.component';
import { SalesManagenentComponent } from './pages/sales-managenent/sales-managenent.component';

const routes: Routes = [
  {
    path: "sales",
    component: SalesManagenentComponent,
  },
  {
    path: "collections",
    component: CollectionsComponent,
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
