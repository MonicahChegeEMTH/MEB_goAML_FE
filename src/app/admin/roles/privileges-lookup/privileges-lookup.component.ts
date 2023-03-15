import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RolesService } from '../roles.service';
import { SystemrolesComponent } from '../systemroles/systemroles.component';

@Component({
  selector: 'app-privileges-lookup',
  templateUrl: './privileges-lookup.component.html',
  styleUrls: ['./privileges-lookup.component.sass']
})
export class PrivilegesLookupComponent implements OnInit {

  rights: any;
  isLoading: boolean = true;

  displayedColumns: string[] = ["select", "name", "accessRight"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  contextMenu: MatMenuTrigger;
  contextMenuPosition = { x: "0px", y: "0px" };

  selection = new SelectionModel<any>(true, []);

  meetingDetails: any;
  meetingId: any;

  constructor(
    public dialogRef: MatDialogRef<SystemrolesComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private service: RolesService,
  ) {

  }

  ngOnInit(): void {
    this.getPrivileges();
  }

  getPrivileges() {
    this.service.getAccessPrivileges()
      .subscribe(
        (res) => {
          this.rights = res;
          console.log(this.rights)
          if (this.rights.length > 0) {
            this.isLoading = false;
            this.dataSource = new MatTableDataSource<any>(this.rights);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  selectPrivileges() {
    this.dialogRef.close({ event: "close", data: this.selection.selected });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}