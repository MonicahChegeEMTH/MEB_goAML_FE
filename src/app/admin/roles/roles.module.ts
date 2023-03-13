import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolesRoutingModule } from './roles-routing.module';
import { SystemrolesComponent } from './systemroles/systemroles.component';
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from '@angular/material/icon';
import { MatTableExporterModule } from "mat-table-exporter";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { AddRolesComponent } from './add-roles/add-roles.component';
import { DeleteRoleComponent } from './delete-role/delete-role.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

@NgModule({
  declarations: [
  SystemrolesComponent,
  AddRolesComponent,
  DeleteRoleComponent,
  UpdateRoleComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
    // CdkAccordionModule,
    // DragDropModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatTableExporterModule,
    MatIconModule,
  ]
})
export class RolesModule { }
