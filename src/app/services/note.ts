import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private apiUrl = 'http://localhost:8080/notes';

  private editorAberto = new BehaviorSubject<boolean>(false);
  public editorAberto$ = this.editorAberto.asObservable();

  constructor(private http: HttpClient) {}

  abrirEditor() {
    this.editorAberto.next(true);
  }

  fecharEditor() {
    this.editorAberto.next(false);
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl);
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(this.apiUrl, note);
  }

  deleteNote(noteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${noteId}`);
  }
}
