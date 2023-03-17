import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FarmerManagenentComponent } from './pages/farmer-managenent/farmer-managenent.component';

const routes: Routes = [

  {
    path: "farmers",
    component: FarmerManagenentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FarmerRoutingModule { }
