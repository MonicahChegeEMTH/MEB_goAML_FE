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
import { CollectionsPerCollectorsComponent } from './pages/collections-per-collectors/collections-per-collectors.component';
import { CollectorsFloatAllocationsComponent } from './pages/collectors-float-allocations/collectors-float-allocations.component';
import { FloatAllocationComponent } from './pages/float-allocation/float-allocation.component';
import { CollectionDetailsComponent } from './pages/collection-details/collection-details.component';
import { EditFloatAllocationComponent } from './pages/edit-float-allocation/edit-float-allocation.component';
import { DeleteFloatAllocationComponent } from './pages/delete-float-allocation/delete-float-allocation.component';
import { LookupOneMilkcollectorComponent } from './pages/lookup-one-milkcollector/lookup-one-milkcollector.component';
import { ProductsAllocationComponent } from './pages/products-allocation/products-allocation.component';
import { AddAllocationComponent } from './pages/add-allocation/add-allocation.component';
import { AgmCoreModule } from '@agm/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkColumnDef } from '@angular/cdk/table';


@NgModule({
    declarations: [
        SalesManagenentComponent,
        CollectionsComponent,
        CollectionsPerCollectorsComponent,
        CollectorsFloatAllocationsComponent,
        FloatAllocationComponent,
        CollectionDetailsComponent,
        EditFloatAllocationComponent,
        DeleteFloatAllocationComponent,
        LookupOneMilkcollectorComponent,
        ProductsAllocationComponent,
        AddAllocationComponent
    ],
    imports: [
        CommonModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCtDO1QdXGeEnX5LA1qOQlpuChPkZJJb1I'
        }),
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
        MatSelectModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
    ],
    providers: [CdkColumnDef]
})
export class SalesModule { }
