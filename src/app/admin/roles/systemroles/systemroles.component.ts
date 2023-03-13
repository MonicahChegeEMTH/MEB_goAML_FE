import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddRolesComponent } from '../add-roles/add-roles.component';
import { DeleteRoleComponent } from '../delete-role/delete-role.component';
import { RolesService } from '../roles.service';
import { UpdateRoleComponent } from '../update-role/update-role.component';

@Component({
  selector: 'app-systemroles',
  templateUrl: './systemroles.component.html',
  styleUrls: ['./systemroles.component.scss']
})
export class SystemrolesComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'action',
  ];


  subscription!: Subscription;
  data: any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  getData() {
      this.subscription = this.service.getRoles().subscribe(res => {
        this.data = res;
        // Binding with the datasource
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  roles:any;
  dataSource!: MatTableDataSource<any>;
  isLoading: boolean = true;

  constructor(private router: Router, private dialog: MatDialog,    private service: RolesService,) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  ngOnInit(): void {
    this.getData();
  }

  addRoleCall(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      test: ""
    }
    this.dialog.open(AddRolesComponent, dialogConfig)
  }

  editRoleCall(role){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      role: role
    }
    this.dialog.open(UpdateRoleComponent, dialogConfig)
  }

  deleteRoleCall(role){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false
    dialogConfig.autoFocus = true
    dialogConfig.width = "500px"
    dialogConfig.data = {
      role: role
    }
    this.dialog.open(DeleteRoleComponent, dialogConfig)
  }


}
