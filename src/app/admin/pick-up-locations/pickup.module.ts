import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PickupRoutingModule } from './pickup-routing.module';
import { AddPickupComponent } from './add-pickup/add-pickup.component';
import { DeletePickupComponent } from './delete-pickup/delete-pickup.component';
import { EditPickupComponent } from './edit-pickup/edit-pickup.component';
import { ViewPickupComponent } from './view-pickup/view-pickup.component';
import { ManagePickupsComponent } from './manage-pickups/manage-pickups.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddPickupComponent, DeletePickupComponent, ViewPickupComponent, EditPickupComponent, ManagePickupsComponent
  ],
  imports: [
    CommonModule,
    PickupRoutingModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTableExporterModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ]
})
export class PickupModule { }
