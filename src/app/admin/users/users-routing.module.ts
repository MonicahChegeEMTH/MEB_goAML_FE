import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UploadedusersComponent } from './uploadedusers/uploadedusers.component';
import { UseraccountsComponent } from './useraccounts/useraccounts.component';
import { ViewCollectorsComponent } from './view-collectors/view-collectors.component';
import { ViewSalesPeopleComponent } from './view-sales-people/view-sales-people.component';
import { ViewStaffComponent } from './view-staff/view-staff.component';

const routes: Routes = [
  {
    path: "",
    component: UseraccountsComponent,
  },
  {
    path: "bulkusers",
    component: UploadedusersComponent,
  },
  {
    path: "profile",
    component: ProfileComponent,
  },
  {
    path: "settings",
    component: SettingsComponent,
  },

  {
    path: "staff",
    component: ViewStaffComponent,
  },

  {
    path: "collectors",
    component: ViewCollectorsComponent,
  },

  {
    path: "sales",
    component: ViewSalesPeopleComponent,
  },
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class UsersRoutingModule { }
