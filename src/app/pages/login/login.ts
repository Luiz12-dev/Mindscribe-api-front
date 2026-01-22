import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  onLogin() {
    const dadosLogin = {
      email: this.email,
      password: this.password,
    };

    this.auth.login(dadosLogin).subscribe({
      next: (res) => {
        console.log('Resposta do Backend:', res);
        alert('Login bem-sucedido!');
      },
      error: (err) => {
        console.error('Erro ao fazer login:', err);
        alert('Falha no login. Verifique suas credenciais.');
      },
    });
  }
}
