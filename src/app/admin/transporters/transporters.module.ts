import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransportersRoutingModule } from './transporters-routing.module';
import { ManageComponent } from './manage/manage.component';
import { AddDialogComponent } from './add-dialog/add-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { WidgetsComponent } from './widgets/widgets.component';


@NgModule({
  declarations: [
    ManageComponent,
    AddDialogComponent,
    EditDialogComponent,
    WidgetsComponent
  ],
  imports: [
    CommonModule,
    TransportersRoutingModule
  ]
})
export class TransportersModule { }
