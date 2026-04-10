import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  form = {
    username: '',
    email: '',
    password: '',
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.form.username || !this.form.email || !this.form.password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.form.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    this.isLoading = true;

    this.auth.register(this.form).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Account created successfully! Redirecting...';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 400) {
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string' && err.error.trim() !== '') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Invalid data provided. Please check your inputs.';
          }
        } else if (err.status === 409) {
          this.errorMessage = 'This email is already registered.';
        } else if (err.status === 401) {
          this.errorMessage = 'Invalid credentials. Please check your data.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }

        this.cdr.detectChanges();
      },
    });
  }
}
