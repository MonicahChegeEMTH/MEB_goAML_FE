import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { UsersRoutingModule } from './users-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { UseraccountsComponent } from './useraccounts/useraccounts.component';
import { AdduserComponent } from './adduser/adduser.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LookupuserComponent } from './lookupuser/lookupuser.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UploadedusersComponent } from './uploadedusers/uploadedusers.component';
import { UserWigetsComponent } from './user-wigets/user-wigets.component';
import { UpdatepasswordComponent } from './updatepassword/updatepassword.component';
import { UpdatedepartmentComponent } from './updatedepartment/updatedepartment.component';
import { DeleteaccountComponent } from './deleteaccount/deleteaccount.component';
import { LockaccountComponent } from './lockaccount/lockaccount.component';
import { RestoreaccountComponent } from './restoreaccount/restoreaccount.component';
import { UnlockaccountComponent } from './unlockaccount/unlockaccount.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LookupMilkCollectorsComponent } from './lookup-milk-collectors/lookup-milk-collectors.component';


@NgModule({
  declarations: [
    UseraccountsComponent,
    AdduserComponent,
    ViewuserComponent,
    UpdateuserComponent,
    LookupuserComponent,
    UploadedusersComponent,
    UserWigetsComponent,
    UpdatepasswordComponent,
    UpdatedepartmentComponent,
    DeleteaccountComponent,
    LockaccountComponent,
    RestoreaccountComponent,
    UnlockaccountComponent,
    ProfileComponent,
    SettingsComponent,
    LookupMilkCollectorsComponent,

  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MatTableModule,
    MatTabsModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableExporterModule,
    SharedModule,
    ComponentsModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
  ]
})
export class UsersModule { }
