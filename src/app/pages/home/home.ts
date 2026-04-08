import { Component, OnDestroy, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { NoteService } from '../../services/note';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home implements OnInit, OnDestroy {
  notas: Note[] = [];
  notasFiltradas: Note[] = [];
  notaAtual: Note | null = null;
  termoBusca = '';

  carregandoNotas = true;
  isSaving = false;

  isEditorOpen = false;
  isDropdownOpen = false;

  private editorSub!: Subscription;
  private triggerSub!: Subscription;
  private searchSub!: Subscription;
  private typingSubject = new Subject<Note>();
  private autoSaveSub!: Subscription;
  private notesListVisibleSubject = new BehaviorSubject<boolean>(true);
  notesListVisible$ = this.notesListVisibleSubject.asObservable();

  constructor(
    private noteService: NoteService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.carregarNotas();

    this.editorSub = this.noteService.editorAberto$.subscribe((statusbar) => {
      this.isEditorOpen = statusbar;
    });

    this.triggerSub = this.noteService.criarNotaTrigger$.subscribe(() => {
      this.criarNovaNota();
    });

    this.autoSaveSub = this.typingSubject.pipe(debounceTime(1000)).subscribe((notaParaSalvar) => {
      this.executarAutoSave(notaParaSalvar);
    });

    this.searchSub = this.noteService.searchTerm$.pipe(debounceTime(300)).subscribe((termo) => {
      this.termoBusca = termo;
      this.filtrarNotas();
    });
  }

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  filtrarNotas() {
    if (!this.termoBusca.trim()) {
      this.notasFiltradas = [...this.notas];
    } else {
      const termoLower = this.termoBusca.toLowerCase().trim();
      this.notasFiltradas = this.notas.filter(
        (nota) =>
          (nota.title || '').toLowerCase().includes(termoLower) ||
          (nota.content || '').toLowerCase().includes(termoLower),
      );
    }
    this.cdr.detectChanges();
  }

  aoDigitar() {
    if (this.notaAtual) {
      this.typingSubject.next({ ...this.notaAtual });
    }
  }

  executarAutoSave(note: Note) {
    if (!note.id) return;

    this.isSaving = true;
    this.cdr.detectChanges();

    this.noteService.updateNote(note.id, note).subscribe({
      next: () => {
        this.isSaving = false;
        this.cdr.detectChanges();

        const index = this.notas.findIndex((n) => n.id === note.id);
        if (index !== -1) {
          this.notas[index] = { ...this.notas[index], title: note.title, content: note.content };
          this.filtrarNotas();
        }
      },
      error: (erro) => {
        console.error('Erro ao salvar nota automaticamente', erro);
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  carregarNotas() {
    this.carregandoNotas = true;

    this.noteService.getNotes().subscribe({
      next: (notasDoBanco) => {
        this.notas = notasDoBanco;
        this.filtrarNotas();
        this.carregandoNotas = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar notas', erro);
        this.carregandoNotas = false;
        this.cdr.detectChanges();
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
        this.filtrarNotas();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao criar nota', erro);
      },
    });
  }

  criarNotaEAbrir() {
    const novaNota: Note = {
      title: '',
      content: '',
    } as Note;

    this.noteService.createNote(novaNota).subscribe({
      next: (notaSalva) => {
        this.notas = [notaSalva, ...this.notas];
        this.notaAtual = notaSalva;
        this.noteService.abrirEditor();
        this.filtrarNotas();
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao criar nota', erro);
      },
    });
  }

  deletarNotaDoDropdown() {
    if (!this.notaAtual || !this.notaAtual.id) return;

    this.isDropdownOpen = false;

    const confirmacao = confirm('Delete this note?');

    if (confirmacao) {
      this.noteService.deleteNote(this.notaAtual.id).subscribe({
        next: () => {
          this.notas = this.notas.filter((n) => n.id !== this.notaAtual?.id);
          this.filtrarNotas();

          if (this.notasFiltradas.length > 0) {
            this.notaAtual = this.notasFiltradas[0];
          } else if (this.notas.length > 0) {
            this.notaAtual = this.notas[0];
          } else {
            this.notaAtual = null;
            this.noteService.fecharEditor();
          }

          this.cdr.detectChanges();
        },
        error: (erro) => {
          console.error('Erro ao deletar nota', erro);
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
    if (this.autoSaveSub) this.autoSaveSub.unsubscribe();
    if (this.searchSub) this.searchSub.unsubscribe();
  }

  voltarDashboard() {
    this.noteService.fecharEditor();
  }

  abrirEditor() {
    this.noteService.abrirEditor();
  }

  abrirNota(notaSelecionada: Note) {
    this.notaAtual = notaSelecionada;
    this.abrirEditor();
  }

  formatarData(dateString?: string): string {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}min ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
    });
  }
}
