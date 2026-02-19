import { Component } from '@angular/core';
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
export class Login {
  credentials = {
    email: '',
    password: '',
  };

  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onLogin() {
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Porfavor preencha todos os dados.';
      return;
    }

    this.auth.login(this.credentials).subscribe({
      next: () => {
        console.log('Login realizado com sucesso !');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao fazer login: ', err);

        if (err.status === 400) {
          // Erro de validação
          this.errorMessage = 'Email ou senha em formato inválido.';
        } else if (err.status === 401) {
          // Erro de autenticação
          this.errorMessage = 'Email ou senha incorretos.';
        } else {
          this.errorMessage = 'Erro ao fazer login. Tente novamente.';
        }

        this.cdr.detectChanges();
      },
    });
  }
}
