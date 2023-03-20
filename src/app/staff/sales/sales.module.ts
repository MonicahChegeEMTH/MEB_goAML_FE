import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesManagenentComponent } from './pages/sales-managenent/sales-managenent.component';
import { ComponentsModule } from "../../shared/components/components.module";
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { CollectionsComponent } from './pages/collections/collections.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
    declarations: [
        SalesManagenentComponent,
        CollectionsComponent
    ],
    imports: [
        CommonModule,
        SalesRoutingModule,
       SharedModule,
        ComponentsModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatTableExporterModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatDatepickerModule,
        MatSelectModule
    ]
})
export class SalesModule { }
