import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FarmerRoutingModule } from './farmer-routing.module';
import { FarmerManagenentComponent } from './pages/farmer-managenent/farmer-managenent.component';
import { ComponentsModule } from "../../shared/components/components.module";
import { RegisterFarmerComponent } from './pages/register-farmer/register-farmer.component';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatSelectModule} from '@angular/material/select';
import { FarmerDetailsComponent } from './pages/farmer-details/farmer-details.component';
import { UpdateFarmerComponent } from './pages/update-farmer/update-farmer.component';
import { DeleteFarmerComponent } from './pages/delete-farmer/delete-farmer.component'; 
import { FarmerLookupComponent } from './pages/farmer-lookup/farmer-lookup.component';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
@NgModule({
    declarations: [
        FarmerManagenentComponent,
        RegisterFarmerComponent,
        FarmerDetailsComponent,
        UpdateFarmerComponent,
        DeleteFarmerComponent,
        FarmerLookupComponent
    ],
    imports: [
        CommonModule,
        FarmerRoutingModule,
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
        MatSelectModule,
        MatProgressBarModule
    ]
})
export class FarmerModule { }
