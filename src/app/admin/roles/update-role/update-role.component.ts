import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { PrivilegesLookupComponent } from '../privileges-lookup/privileges-lookup.component';
import { RolesService } from '../roles.service';
import { SystemrolesComponent } from '../systemroles/systemroles.component';

@Component({
  selector: 'app-update-role',
  templateUrl: './update-role.component.html',
  styleUrls: ['./update-role.component.sass']
})
export class UpdateRoleComponent implements OnInit {

  addRoleForm: FormGroup;
  loading = false;
  selection = new SelectionModel<any>(true, []);
  dialogData: any;
  privilegesSelected = [];

  displayedColumns: string[] = ["privilege", "action"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<SystemrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private snackbar: SnackbarService,
    private service: RolesService,
    private dialog: MatDialog) { }
  subscription!: Subscription;


  ngOnInit(): void {
    this.loadPrivileges();
    this.addRoleForm = this.fb.group({
      id:[this.data.roles.id],
      name: [this.data.roles.name, [Validators.required]],
      accessRights: new FormArray([])
    });
  }

  loadPrivileges()
  {
    this.dataSource = new MatTableDataSource(this.data.roles.accessRights);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  onSubmit() {
    this.loading = true;
    this.subscription = this.service.updateRole(this.addRoleForm.value).subscribe(res => {
      this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
      this.loading = false;
      this.addRoleForm.reset();
      this.dialogRef.close();
    }, err => {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", err);
      this.dialogRef.close();
    })
  }

  pickPrivileges() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(PrivilegesLookupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.privilegesSelected = result.data;
      if (this.privilegesSelected.length > 0) {
        this.dataSource = new MatTableDataSource<any>(this.privilegesSelected);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.addRoleForm.value.accessRights = this.privilegesSelected;
      }
    });
  }

  removePrivilege(index: any) {
    this.privilegesSelected.splice(index, 1);
    this.dataSource = new MatTableDataSource<any>(this.privilegesSelected);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.addRoleForm.value.accessRights = this.privilegesSelected;
  }

  onClick() {
    this.dialogRef.close();
  }
}

