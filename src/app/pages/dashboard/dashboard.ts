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

  constructor(private noteService: NoteService, private router: Router){}

  ngOnInit(): void {
    this.carregarNotas();
  }

  carregarNotas(){
    this.noteService.getNotes().subscribe({
      next: (dados) => {
        this.notes = dados;
        console.log('Notas carregadas:', this.notes);
      },
      error: (erro) => console.log('Erro ao carregar notas:', erro)
    });


  criarNota(){

  }

  }





}
