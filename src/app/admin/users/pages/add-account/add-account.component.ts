import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UserService } from 'src/app/data/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

interface RoleOption {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.sass'],
})
export class AddAccountComponent extends BaseComponent implements OnInit {
  userForm: FormGroup;
  loading = false;

  roles: RoleOption[] = [
    { id: 1, name: 'ROLE_ADMIN' },
    { id: 2, name: 'ROLE_RISKOFFICER' },
    { id: 3, name: 'ROLE_AUDITOR' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/),
        ],
      ],
      lastname: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z\s]+$/),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?(?:[()\s.-]*\d){10,20}$/),
        ],
      ],
      employeeNumber: ['', [Validators.required]],
      role: [null, Validators.required],
    });
  }

  onCancel() {
    this.router.navigate([`/admin/user-accounts/all`]);
  }

  addUser() {
    if (this.userForm.invalid) {
      this.snackbar.showNotification(
        'snackbar-danger',
        'Please fill in all required fields.'
      );
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const payload = { ...this.userForm.value };

    this.userService
      .createUserAccounts(payload)
      .pipe(takeUntil(this.subject))
      .subscribe({
        next: (res) => {
          this.loading = false;

          this.snackbar.showNotification(
            'snackbar-success',
            'User added successfully!'
          );

          this.router.navigate(['/admin/user-accounts/all']);
        },
        error: (err) => {
          this.loading = false;

          const errorMsg =
            err?.error?.message ||
            (typeof err?.error === 'string'
              ? err.error
              : 'User creation failed. Please try again.');

          this.snackbar.showNotification('snackbar-danger', errorMsg);
        },
      });
  }
}
