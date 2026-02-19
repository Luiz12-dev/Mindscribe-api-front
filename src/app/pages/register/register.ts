import { Component } from '@angular/core';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
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

  errorMessage: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  onSubmit() {
    this.errorMessage = '';

    if (!this.form.username || !this.form.email || !this.form.password) {
      this.errorMessage = 'Porfavor preencha todos os dados !';
      return;
    }

    this.auth.register(this.form).subscribe({
      next: (res) => {
        alert('Registro feito com sucesso');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Erro ao registrar: ', err);

        if (err.status === 401) {
          this.errorMessage = 'Credenciais inválidas. Verifique seus dados.';
        } else if (err.status === 409) {
          this.errorMessage = 'Este email já está cadastrado.';
        } else {
          this.errorMessage = 'Erro ao registrar. Tente novamente.';
        }

        this.cdr.detectChanges(); // ou use uma das outras soluções
      },
    });
  }
}
