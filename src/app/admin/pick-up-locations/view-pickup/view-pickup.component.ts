import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ManagePickupsComponent } from '../manage-pickups/manage-pickups.component';
import { PickupService } from '../pickup.service';

@Component({
  selector: 'app-view-pickup',
  templateUrl: './view-pickup.component.html',
  styleUrls: ['./view-pickup.component.sass']
})
export class ViewPickupComponent implements OnInit {

  loading = false;
  addLocationForm: FormGroup;
  dialogData: any;
  items: MilkCollectors[] = [];

  displayedColumns: string[] = ["id", "username"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ManagePickupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private service: PickupService,) { }
  subscription!: Subscription;


  ngOnInit(): void {
    this.addLocationForm = this.fb.group({
      name: [this.data.location.name, [Validators.required]],
      subCounty: [this.data.location.subcounty],
      wardName: [this.data.location.ward],
      landMark: [this.data.location.landmark],
    });

    this.getMilkCollectors();
  }

  response: any;
  getMilkCollectors() {
    this.subscription = this.service.getLocationById(this.data.location.id).subscribe(res => {
      this.response = res;
      this.items = this.response.entity.collectors;
      this.dataSource = new MatTableDataSource<any>(this.items);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onClick() {
    this.dialogRef.close();
  }
}

export class MilkCollectors {
  public username: string;
}
