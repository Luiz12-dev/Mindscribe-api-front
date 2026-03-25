import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { NoteService } from '../../services/note';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit, OnDestroy {
  notas: Note[] = [];
  notaAtual: Note | null = null;

  isEditorOpen: boolean = false;
  isDropdownOpen = false;

  private editorSub!: Subscription;
  private triggerSub!: Subscription;
  private notesListVisibleSubject = new BehaviorSubject<boolean>(true);
  notesListVisible$ = this.notesListVisibleSubject.asObservable();

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.carregarNotas();

    this.editorSub = this.noteService.editorAberto$.subscribe((statusbar) => {
      this.isEditorOpen = statusbar;
    });

    this.triggerSub = this.noteService.criarNotaTrigger$.subscribe(() => {
      this.criarNovaNota();
    });
  }

  carregarNotas() {
    this.noteService.getNotes().subscribe({
      next: (notasDoBanco) => {
        this.notas = notasDoBanco;
      },
      error: (erro) => {
        console.error('Erro ao buscar notas do Spring Boot', erro);
      },
    });
  }

  criarNovaNota() {
    const novaNota: Note = {
      title: '',
      content: '',
    } as Note;

    this.noteService.createNote(novaNota).subscribe({
      next: (notaSalva) => {
        this.notas = [notaSalva, ...this.notas];
        this.notaAtual = notaSalva;

        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('erro ao criar nota no banco', erro);
      },
    });
  }

  deletarNotaDoDropdown() {
    if (!this.notaAtual || !this.notaAtual.id) return;

    this.isDropdownOpen = false;

    const confirmacao = confirm('Delete this note ?');

    if (confirmacao) {
      this.noteService.deleteNote(this.notaAtual.id).subscribe({
        next: () => {
          this.notas = this.notas.filter((n) => n.id !== this.notaAtual?.id);

          this.cdr.detectChanges();

          if (this.notas.length > 0) {
            this.notaAtual = this.notas[0];
          } else {
            this.notaAtual = null;
          }
        },
        error: (erro) => {
          console.error('erro ao deletar nota', erro);
        },
      });
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleNotesList() {
    const isVisible = this.notesListVisibleSubject.getValue();
    this.notesListVisibleSubject.next(!isVisible);
  }

  selecionarNota(nota: Note) {
    this.notaAtual = nota;
    this.isDropdownOpen = false;
  }

  ngOnDestroy(): void {
    if (this.editorSub) this.editorSub.unsubscribe();
    if (this.triggerSub) this.triggerSub.unsubscribe();
  }

  voltarDashboard() {
    this.noteService.fecharEditor();
  }

  abrirEditor() {
    this.noteService.abrirEditor();
  }
}
