import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/service/auth.service';
import { Role } from 'src/app/core/models/role';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { TokenStorageService } from 'src/app/core/service/token-storage.service';
import { NotificationService } from 'src/app/data/services/notification.service';
import { SnackbarService } from 'src/app/shared/snackbar.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  authForm: FormGroup;
  otpForm: FormGroup;
  resetForm: FormGroup;
  loginForm: FormGroup;
  submitted = false;
  otpStep = false;
  resetStep = false;
  maskedEmail = '';
  loading = false;
  loginType: 'system' | 'organization' = 'organization';
  hidePassword = true;
  error = '';
  hide = true;
  currentYear: number = new Date().getFullYear();
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private notificationService: NotificationService,
    private snackbar: SnackbarService,
  ) {
    super();
  }

  setLoginType(type: 'system' | 'organization') {
    this.loginType = type;
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.otpForm = this.formBuilder.group({
      first: ['', Validators.required],
      second: ['', Validators.required],
      third: ['', Validators.required],
      fourth: ['', Validators.required],
      fifth: ['', Validators.required],
      sixth: ['', Validators.required],
    });

    this.resetForm = this.formBuilder.group(
      {
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    this.currentYear = new Date().getFullYear();
  }
  get f() {
    return this.authForm.controls;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('newPassword')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  onVerifyOtp() {
    const otp =
      this.otpForm.value.first +
      this.otpForm.value.second +
      this.otpForm.value.third +
      this.otpForm.value.fourth +
      this.otpForm.value.fifth +
      this.otpForm.value.sixth;

    this.loading = true;

    const payload = {
      username: this.maskedEmail,
      otp: otp,
    };

    this.authService.verifyOtp(payload).subscribe({
      next: (res: any) => {
        this.loading = false;

        const data = res.entity ?? res;

        /* OTP SUCCESS BUT RESET REQUIRED */
        if (data.firstLogin === true || data.requiresPasswordReset === true) {
          this.resetStep = true;
          this.otpStep = false;
          return;
        }

        /* OTP SUCCESS → LOGIN COMPLETE */
        this.tokenStorage.saveToken(data.token, data.refreshToken);
        this.tokenStorage.saveUser(data);

        const role = data.role;
        console.log('LOGIN RESPONSE:', data);

        if (role === Role.Admin) {
          this.router.navigate(['/admin/dashboard/main']);
        } else if (role === Role.Riskofficer) {
          this.router.navigate(['/riskofficer/dashboard/main']);
        } else if (role === Role.Auditor) {
          this.router.navigate(['/auditor/dashboard/main']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.loading = false;
        this.snackbar.showNotification(
          'snackbar-danger',
          'Invalid OTP. Please try again.',
        );
      },
    });
  }

  onResetPassword() {
    if (this.resetForm.invalid) return;

    this.loading = true;

    const payload = {
      username: this.maskedEmail,
      newPassword: this.resetForm.value.newPassword,
    };

    this.authService.firstLoginresetPassword(payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackbar.showNotification(
          'snackbar-success',
          'Password reset successful. Please log in.',
        );
        this.resetStep = false;
        this.authForm.reset();
      },
      error: () => (this.loading = false),
    });
  }

  onSubmit() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.submitted = true;
    this.loading = true;
    this.error = '';

    if (this.authForm.invalid) {
      this.error = 'Username and Password not valid!';
      this.loading = false;
      return;
    }

    this.authService.login(this.authForm.value).subscribe(
      (response: any) => {
        const res = response.entity ?? response;

        /* -------- FIRST LOGIN FLOW -------- */
        if (res.firstLogin === true) {
          this.resetStep = true;
          this.otpStep = false;
          this.loading = false;
          this.submitted = false;

          this.maskedEmail = res.username;

          this.snackbar.showNotification('snackbar-warning', res.message);
          return;
        }

        /* -------- OTP FLOW -------- */
        if (res.otp) {
          this.otpStep = true;
          this.resetStep = false;
          this.loading = false;
          this.submitted = false;

          this.maskedEmail = res.username;

          this.snackbar.showNotification('snackbar-info', res.message);
          return;
        }

        /* -------- NORMAL LOGIN (NO OTP, NO RESET) -------- */
        this.tokenStorage.saveToken(res.token, res.refreshToken);
        this.tokenStorage.saveUser(res);

        const role = res.role;

        setTimeout(() => {
          if (role === Role.Admin) {
            this.router.navigate(['/admin/dashboard/main']);
          } else if (role === Role.Riskofficer) {
            this.router.navigate(['/riskofficer/dashboard/main']);
          } else if (role === Role.Auditor) {
            this.router.navigate(['/auditor/dashboard/main']);
          } else {
            this.error = 'Invalid Login';
          }
        }, 100);

        this.loading = false;
        this.submitted = false;

        this.snackbar.showNotification(
          'snackbar-success',
          'Login successful. Welcome ' + res.username + '!',
        );
      },
      (err) => {
        const backendMessage =
          err?.error?.message ||
          err?.message ||
          'Login failed. Please try again.';

        this.error = backendMessage;
        this.submitted = false;
        this.loading = false;

        this.notificationService.alertWarning(backendMessage);
      },
    );
  }
  moveForward(event: any, nextInputName?: string) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 1 && nextInputName) {
      const nextInput = document.querySelector<HTMLInputElement>(
        `[formControlName="${nextInputName}"]`,
      );
      if (nextInput) nextInput.focus();
    }
  }

  moveBackward(event: KeyboardEvent, prevInputName?: string) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && prevInputName) {
      const prevInput = document.querySelector<HTMLInputElement>(
        `[formControlName="${prevInputName}"]`,
      );
      if (prevInput) prevInput.focus();
    }
  }
}
