import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  credentials = {
    email: '',
    password: '',
  };

  errorMessage = '';
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

  onLogin() {
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please, fill all the fields';
      return;
    }

    this.isLoading = true;

    this.auth.login(this.credentials).subscribe({
      next: (resposta) => {
        localStorage.setItem('auth_token', resposta.token);
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;

        if (err.status === 400) {
          this.errorMessage = 'Email or password in a invalid format.';
        } else if (err.status === 401) {
          this.errorMessage = 'Email ou password incorrect.';
        } else {
          this.errorMessage = 'Error to login. Try again.';
        }

        this.cdr.detectChanges();
      },
    });
  }
}
