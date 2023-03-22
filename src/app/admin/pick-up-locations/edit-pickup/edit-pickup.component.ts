import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { SubCountiesLookupComponent } from '../../sub-counties/sub-counties-lookup/sub-counties-lookup.component';
import { SubcountiesService } from '../../sub-counties/subcounties.service';
import { LookupMilkCollectorsComponent } from '../../users/pages/milk-collectors/lookup-milk-collectors/lookup-milk-collectors.component';
import { ManagePickupsComponent } from '../manage-pickups/manage-pickups.component';
import { PickupService } from '../pickup.service';

@Component({
  selector: 'app-edit-pickup',
  templateUrl: './edit-pickup.component.html',
  styleUrls: ['./edit-pickup.component.sass']
})
export class EditPickupComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  loading = false;
  addLocationForm: FormGroup;
  dialogData: any;
  milkCollectors = [];
  items: MilkCollectors[] = [];
  name: any;
  wards: any;

  displayedColumns: string[] = ["id", "username", "actions"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ManagePickupsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: PickupService,
    private wardsService: SubcountiesService,
    private dialog: MatDialog,) { }
  subscription!: Subscription;


  ngOnInit(): void {
    this.addLocationForm = this.fb.group({
      id: [this.data.location.id],
      name: [this.data.location.name, [Validators.required]],
      ward_fk: [""],
      subCounty: [this.data.location.subcounty],
      subcounty_fk: [""],
      landMark: [this.data.location.landmark, [Validators.required]],
      collectors: new FormArray([])
    });

    this.getMilkCollectors();
  }

  response: any;
  getMilkCollectors() {
    this.subscription = this.service.getLocationById(this.data.location.id).subscribe(res => {
      this.response = res;
      this.items = this.response.entity.collectors;
      this.dataSource = new MatTableDataSource<any>(this.items);
      this.addLocationForm.patchValue({
        subCounty: this.dialogData.data.subcounty,
        subcounty_fk: this.response.entity.subcounty_fk,
        ward_fk: this.response.entity.ward_fk
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.addLocationForm.value.collectors = this.items;
    })
  }

  getWards(id: any) {
    this.subscription = this.wardsService.getSubCountyById(id).subscribe(res => {
      this.data = res;
      if (this.data.entity.wards.length > 0) {
        this.wards = this.data.entity.wards;
      }
      else {
      }
    })
  }

  onSubmit() {
    this.loading = true;
    console.log(this.addLocationForm.value)
    this.subscription = this.service.updateLocation(this.addLocationForm.value).subscribe(res => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-success", "Successful!");
      this.addLocationForm.reset();
      this.dialogRef.close();
    }, err => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", err);
      this.dialogRef.close();
    })
  }

  pickSubCountyDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(SubCountiesLookupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.dialogData = result;
      this.addLocationForm.patchValue({
        subCounty: this.dialogData.data.subcounty,
        subcounty_fk: this.dialogData.data.id
      });

      this.getWards(this.dialogData.data.id);
    });
  }


  pickMilkCollectorsDialog(department): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {
      department: department,
    };
    const dialogRef = this.dialog.open(LookupMilkCollectorsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.milkCollectors = result.data;
      if (this.milkCollectors.length > 0) {
        this.dataSource = new MatTableDataSource<any>(this.milkCollectors);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.addLocationForm.value.collectors = this.milkCollectors;
      }
    });
  }


  onClick() {
    this.dialogRef.close();
  }

  removeUser(index: any) {
    this.milkCollectors.splice(index, 1);
    this.dataSource = new MatTableDataSource<any>(this.milkCollectors);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.addLocationForm.value.collectors = this.milkCollectors;
  }
}

export class MilkCollectors {
  id: any;
  public username: string;
}
