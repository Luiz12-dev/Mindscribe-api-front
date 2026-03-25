import { Component } from '@angular/core';
import { NoteService } from '../../services/note';
import { Router } from '@angular/router';

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
  ) {}

  onSearch(event: Event) {
    const valorDigitado = (event.target as HTMLInputElement).value;

    console.log('Usuário está buscando por:', valorDigitado);
  }

  createNewNote() {
    this.noteService.solicitarCriacaoDeNota();

    this.noteService.abrirEditor();
    console.log('Sidebar enviou o comando: Abrir Editor!');
  }

  createChekList() {
    console.log('Ação: Cria novo checklist rápido');
  }

  openCalendar() {
    console.log('Ação: Abrir calendário');
  }

  openMoreOptions() {
    console.log('Ação: Abrir menu flutuante de mais opções');
  }

  voltarDashboard() {
    this.noteService.fecharEditor();
  }

  abrirEditor() {
    this.noteService.abrirEditor();
  }

  voltarLogin() {
    this.router.navigate(['/']);
  }
}
