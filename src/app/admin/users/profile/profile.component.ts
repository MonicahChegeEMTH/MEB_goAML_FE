import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

  id: any;
  subscription!: Subscription;
  role: any;
  loading = false;
  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private tokenStorageService:TokenStorageService
  ) {

  }


  ngOnInit(): void {
    this.id = this.tokenStorageService.getUser().id;
    this.createForm();
    this.getProfile();
  }

  createForm() {
    this.userForm = this.fb.group({
      email: '',
      firstname: '',
      lastname: '',
      modifiedBy: '',
      password: '',
      phonenumber: '',
      deleteFlag: '',
      isAcctLocked: '',
      isLoggedIn: '',
      isAcctActive: '',
      username: '',
      createdOn: '',
      role: '',
      reportingTo: '',
      department: '',
    });

  }

  getProfile() {
    this.loading = true;
    this.subscription = this.authService.getUserById(this.id).subscribe(res => {
      this.userForm.patchValue({
        email: res.email,
        firstname: res.firstname,
        lastname: res.lastname,
        phonenumber: res.phonenumber,
        deleteFlag: res.deleteFlag,
        isAcctLocked: res.isAcctLocked,
        isAcctActive: res.isAcctActive,
        username: res.username,
        createdOn: res.createdOn,
        role: res.roles[0].name,
        department: res.department,
        reportingTo: res.reportingTo
      })
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }
}
