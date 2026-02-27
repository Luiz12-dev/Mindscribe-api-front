import { Component } from '@angular/core';
import { NoteService } from '../../services/note';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  constructor(private noteService: NoteService) {}

  onSearch(event: Event) {
    const valorDigitado = (event.target as HTMLInputElement).value;

    console.log('Usuário está buscando por:', valorDigitado);
  }

  createNewNote() {
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
}
