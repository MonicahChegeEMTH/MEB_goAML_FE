import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { UploadedusersComponent } from './uploadedusers/uploadedusers.component';
import { UseraccountsComponent } from './useraccounts/useraccounts.component';

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
]


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],

  exports: [RouterModule],
})
export class UsersRoutingModule { }
