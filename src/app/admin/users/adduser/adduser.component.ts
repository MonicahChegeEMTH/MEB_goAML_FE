import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { RolesService } from '../../roles/roles.service';
import { LookupuserComponent } from '../lookupuser/lookupuser.component';
import { UseraccountsComponent } from '../useraccounts/useraccounts.component';
import * as XLSX from "xlsx";
import { LookupdepartmentsComponent } from '../../departments/lookupdepartments/lookupdepartments.component';

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.sass']
})
export class AdduserComponent implements OnInit {

  userForm: FormGroup;
  roles: any;
  departments: any;
  name: any;
  code: any;
  senior: any;
  loading = false;
  selected = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AuthService,
    private rolesService: RolesService,
    private snackbar: SnackbarService,
    public dialogRef: MatDialogRef<UseraccountsComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstname: ["", [Validators.required]],
      lastname: ["", [Validators.required]],
      username: ["", [Validators.required]],
      phonenumber: ["", [Validators.required]],
      email: ["", [Validators.required]],
      roles: new FormArray([]),
      role: [""],
      department: [""],
      departmentId: [""],
    });

    this.getRoles();
  }

  bindRole()
  {
    this.userForm.value.roles.push(this.selected);
    console.log(this.userForm.value.roles)
  }

  onCancel() {
    this.dialogRef.close();
  }

  addUser() {
    this.loading = true;
    console.log(this.userForm.value)
    this.accountService.registerUser(this.userForm.value).subscribe(
      (res) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-success", "Successful!");
        this.userForm.reset();
        this.dialogRef.close();
      },
      (err) => {
        this.loading = false;
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }


  getRoles() {
    this.rolesService.getRoles().subscribe(
      (res) => {
        this.roles = res;
      },
      (err) => {
        this.snackbar.showNotification("snackbar-danger", err);
      }
    );
  }


  //Dowload template
  getTemplate() {
    this.accountService
      .usersTemplateDownload()
      .subscribe(
        (response) => {
          console.log(response)
          const a = document.createElement("a");
          document.body.appendChild(a);
          const blob: any = new Blob([response.data], {
            type: "octet/stream",
          });
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = "UsersUploadTemplate.xlsx";
          a.click();
          window.URL.revokeObjectURL(url);

          this.loading = false;


          this.snackbar.showNotification(
            "Template downloaded successfully!", "snackbar-success",
          );
        },
      )
  }

  pickDepartmentDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "50%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(LookupdepartmentsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.departments = result;
      this.name = this.departments.departmentName;
      this.userForm.patchValue({
        department: this.name,
        departmentId: this.departments.id
      });
    });
  }

  pickReportingToDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "55%";
    dialogConfig.data = {
      user: '',
    };
    const dialogRef = this.dialog.open(LookupuserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      this.senior = result;
      this.userForm.patchValue({
        reportingTo: this.senior,
      });
    });
  }



  //Excel Upload
  submit() {
    if (this.headerRows.length != this.otherRows[0].length) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Number of headers " + this.headerRows.length + " And data provided do not match!"
      );
      this.loading = false;
    } else if (this.headerRows.length > 10) {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please Ensure The Column Count Does Not Exceed 10!"
      );
      this.loading = false;
    }

    else if (this.headerRows[0] != "department") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the first column is Department!"
      );
      this.loading = false;
    }
    else if (this.headerRows[1] != "email") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the second column is Email!"
      );
      this.loading = false;
    }
    else if (this.headerRows[2] != "firstname") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the third column is Firstname!"
      );
      this.loading = false;
    }
    else if (this.headerRows[3] != "lastname") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the fourth column is Lastname!"
      );
      this.loading = false;
    }
    else if (this.headerRows[4] != "phonenumber") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the fifth column is Phonenumber!"
      );
      this.loading = false;
    }
    else if (this.headerRows[5] != "reportingTo") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the sixth column is Reporting To!"
      );
      this.loading = false;
    }
    else if (this.headerRows[6] != "username") {
      this.snackbar.showNotification(
        "snackbar-danger",
        "Please ensure that the seventh column is Username!"
      );
      this.loading = false;
    }
    else {
      this.loading = true;
      this.accountService.bulkUploadUsers(this.valuesArray)
        .subscribe(
          (res) => {
            this.snackbar.showNotification(
              "snackbar-success", "SUCCESSFUL!"
            );
            this.loading = false;
            this.dialogRef.close();
            this.router.navigate(['/admin/users/bulkusers'])
          },
          (err) => {
            this.loading = false;
            this.snackbar.showNotification("snackbar-danger", err);
          }
        );
    }

  }


  exceldata: [][] | undefined;
  keys: string[];
  otherRows: any[];
  dataSheet = new Subject();
  headerRows: any;
  fileAcess: any;
  fileName: any;
  firstElement: any;
  excelSelected: any;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = "";
  messageSuccess = "";
  fileInfos?: Observable<any>;
  jsonHeader: any;
  jsonRows: any;
  values: any;
  finalValues: any;
  valuesArray: any;
  typeIsSelected: boolean = false;
  emailTemps: any;
  smsTemps: any;


  onFileChange(evt: any) {
    const file: File = evt.target.files[0];
    this.fileAcess = file;

    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1)
      throw new Error("Multiple Files Not Supported!");

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.exceldata = XLSX.utils.sheet_to_json(ws, { header: 1 });
      if (this.exceldata) {
        this.excelSelected = true;
      }

      this.headerRows = this.exceldata[0];
      this.otherRows = this.exceldata.slice(1);
      this.firstElement = this.headerRows[0];
      this.headerRows = this.headerRows.filter(e => e.length);
      this.otherRows = this.otherRows.filter(e => e.length);
      this.values = this.otherRows.map((e) =>
        this.headerRows.reduce((o, f, j) => Object.assign(o, { [f]: e[j] }), {})
      );

      this.finalValues = this.values.filter((value: {}) => Object.keys(value).length !== 0);
      this.valuesArray = { key: this.finalValues };
    };

    reader.readAsBinaryString(target.files[0]);
  }

  // Codes relating to upload File start
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
}
