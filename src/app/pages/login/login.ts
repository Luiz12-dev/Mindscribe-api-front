import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
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
          this.errorMessage = 'Email ou senha em formato inválido.';
        } else if (err.status === 401) {
          this.errorMessage = 'Email ou senha incorretos.';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }
      },
    });
  }
}
