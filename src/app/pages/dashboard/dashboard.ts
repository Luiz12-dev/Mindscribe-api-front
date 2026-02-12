import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note';
import { Note } from '../../models/note.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  notes: Note[] = [];
  newTitle = '';
  newContent = '';

  constructor(
    private noteService: NoteService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas() {
    this.noteService.getNotes().subscribe({
      next: (dados) => {
        this.notes = dados;
        console.log('Notas carregadas:', this.notes);
      },
      error: (erro) => console.log('Erro ao carregar notas:', erro),
    });
  }

  createNote() {
    if (!this.newTitle.trim() || !this.newContent.trim()) {
      alert('Preencha título e conteúdo');
      return;
    }

    const novaNota = {
      title: this.newTitle,
      content: this.newContent,
    };

    this.noteService.createNote(novaNota).subscribe({
      next: (notaCriada) => {
        alert('Nota criada com sucesso!');
        this.notes.push(notaCriada);

        this.newContent = '';
        this.newTitle = '';
      },
      error: (err) => {
        console.error('Erro ao criar: ', err);
        alert('Erro ao salvar Nota');
      },
    });
  }

  deleteNote(id: string | undefined) {
    if (!id) {
      return;
    }
    if (confirm('Tem certeza que deseja deletar essa nota ?')) {
      this.noteService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter((n) => n.id !== id);
          alert('Nota excluida');
        },
        error: (err) => {
          console.error('Erro ao excluir: ', err);
          alert('Erro ao excluir nota');
        },
      });
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/']);
  }
}
