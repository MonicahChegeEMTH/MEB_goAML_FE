import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigsService } from 'src/app/staff/stock/configs/configs.service';
import { ManageComponent } from '../manage/manage.component';

@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.sass']
})
export class AddDialogComponent implements OnInit {
  form: FormGroup
  routes: any[] = []
  users: any[] = []
  loading: boolean = false

  constructor(private fb: FormBuilder, private configService: ConfigsService, private dialogRef: MatDialogRef<ManageComponent>) { }

  ngOnInit(): void {
    this.form=this.fb.group({
      routeId: ['', [Validators.required]],
      username: ['', [Validators.required]]
    })

    this.getRoutes()
  }


  getRoutes() {
    this.configService.getRoutes().subscribe({
      next: (res) => {
        if (res.entity.length > 0) {
          this.routes = res.entity
        } else {
          this.routes = []
        }
      },
      error: (error) => {
        console.log("caught error",error)
      }
    })
  }

  getTransporters() {}

  cancel() {
    this.dialogRef.close()
  }

  submit() {}
}
