import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

  updatePasswordForm: FormGroup;
  loading = false;
  username: any;
  password: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountService: AuthService,
    private snackbar: SnackbarService,
    private tokenStorageService: TokenStorageService
  ) {

  }

  createForm() {
    this.updatePasswordForm = this.fb.group({
      password: ['', [Validators.required]],
      confirmpassword: ['', [Validators.required]],
      username: [this.username, [Validators.required]],
      currpassword: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.username = this.tokenStorageService.getUser().username;
    this.createForm();
  }


  onSubmit() {
    if (this.updatePasswordForm.value.password == this.updatePasswordForm.value.confirmpassword) {
      this.loading = true;
      this.accountService.updateUserPassword({
        password: this.updatePasswordForm.value.password,
        username: this.updatePasswordForm.value.username,
      }).subscribe(
        (res) => {
          this.loading = false;
          this.snackbar.showNotification("snackbar-success", "SUCCESSFUL!");
          this.updatePasswordForm.reset();
          this.tokenStorageService.signOut();
          this.router.navigate(["/authentication/signin"]);
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification("snackbar-danger", err);
        }
      );

    }
    else {
      this.loading = false;
      this.snackbar.showNotification("snackbar-danger", "PASSWORDS MISMATCH!");
    }
  }

}
