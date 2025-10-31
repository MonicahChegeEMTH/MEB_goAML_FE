import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { NotificationService } from 'src/app/data/services/notification.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';
import { AuthService } from 'src/app/data/services/auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {
  authForm: FormGroup;
  submitted = false;
  returnUrl: string;
  usernameSelected: boolean = false;
  mobileSelected: boolean = false;
  emailSelected: boolean = true;

  loading = false;
  error = '';
  hide = true;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private snackbar: SnackbarService,
    private notificationAPI: NotificationService
  ) {
    super();
  }
  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: ['', [Validators.email]],
      mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      username: [''],
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  get f() {
    return this.authForm.controls;
  }

  selectOption(event) {
    console.log(event.value);
    if (event.value == 'Email') {
      this.emailSelected = true;
      this.mobileSelected = false;
      this.usernameSelected = false;
      this.authForm.reset();
    } else if (event.value == 'Username') {
      this.emailSelected = false;
      this.mobileSelected = false;
      this.usernameSelected = true;
      this.authForm.reset();
    } else if (event.value == 'Mobile') {
      this.emailSelected = false;
      this.mobileSelected = true;
      this.usernameSelected = false;
      this.authForm.reset();
    } else {
      this.emailSelected = false;
      this.mobileSelected = false;
      this.usernameSelected = false;
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    // Reset spinner initially (prevents stuck spinner on previous state)
    this.loading = false;

    // --- EMAIL OPTION ---
    if (this.emailSelected) {
      const emailControl = this.authForm.get('email');

      if (!emailControl.value) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Please provide your email address!'
        );
        return;
      }

      if (emailControl.invalid) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Please enter a valid email format!'
        );
        return;
      }

      this.loading = true;

      this.authService.forgotPasswordDetails(this.authForm.value).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode === 200 || res.statusCode === 201) {
            this.snackbar.showNotification('snackbar-success', res.message);
            this.router.navigate(['/authentication/signin']);
          } else {
            this.snackbar.showNotification('snackbar-danger', res.message);
          }
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification(
            'snackbar-danger',
            err.error.error || 'An error occurred'
          );
          console.error(err);
        }
      );

      // --- MOBILE OPTION ---
    } else if (this.mobileSelected) {
      const mobileControl = this.authForm.get('mobile');

      if (!mobileControl.value) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Please provide your mobile number!'
        );
        return;
      }

      if (mobileControl.invalid) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Please enter a valid 10-digit mobile number!'
        );
        return;
      }

      this.loading = true;

      this.authService.forgotPasswordDetails(this.authForm.value).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode === 200 || res.statusCode === 201) {
            this.snackbar.showNotification('snackbar-success', res.message);
            this.router.navigate(['/authentication/signin']);
          } else {
            this.snackbar.showNotification('snackbar-danger', res.message);
          }
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification(
            'snackbar-danger',
            err.error.error || 'An error occurred'
          );
          console.error(err);
        }
      );

      // --- USERNAME OPTION ---
    } else if (this.usernameSelected) {
      const usernameControl = this.authForm.get('username');

      if (!usernameControl.value) {
        this.snackbar.showNotification(
          'snackbar-danger',
          'Please provide your username!'
        );
        return;
      }

      this.loading = true;

      this.authService.forgotPasswordDetails(this.authForm.value).subscribe(
        (res) => {
          this.loading = false;
          if (res.statusCode === 200 || res.statusCode === 201) {
            this.snackbar.showNotification('snackbar-success', res.message);
            this.router.navigate(['/authentication/signin']);
          } else {
            this.snackbar.showNotification('snackbar-danger', res.message);
          }
        },
        (err) => {
          this.loading = false;
          this.snackbar.showNotification(
            'snackbar-danger',
            err.error.error || 'An error occurred'
          );
          console.error(err);
        }
      );

      // --- NO OPTION SELECTED ---
    } else {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please select Email, Mobile, or Username to reset your password!'
      );
    }
  }
}
