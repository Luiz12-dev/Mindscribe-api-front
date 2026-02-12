import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  form = {
    username: '',
    email: '',
    password: '',
  };

  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  onSubmit() {
    if (!this.form.username || !this.form.email || !this.form.password) {
      alert('Preencha todos os campos');
      return;
    }

    this.auth.register(this.form).subscribe({
      next: (res) => {
        alert('Registro feito com sucesso');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao registrar: ', err);
        alert('Erro ao criar conta. Tente outro email ou verifique os dados');
      },
    });
  }
}
