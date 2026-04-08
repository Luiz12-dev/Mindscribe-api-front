import { Component } from '@angular/core';
import { NoteService } from '../../services/note';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(
    private noteService: NoteService,
    private router: Router,
    private auth: Auth,
  ) {}

  onSearch(event: Event) {
    const termo = (event.target as HTMLInputElement).value;
    this.noteService.buscar(termo);
  }

  createNewNote() {
    this.noteService.solicitarCriacaoDeNota();
    this.noteService.abrirEditor();
  }

  voltarDashboard() {
    this.noteService.fecharEditor();
  }

  abrirEditor() {
    this.noteService.abrirEditor();
  }

  voltarLogin() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
