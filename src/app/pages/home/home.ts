import { Component, OnDestroy, OnInit } from '@angular/core';
import { NoteService } from '../../services/note';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  notas: any[] = [];

  isEditorOpen: boolean = false;

  private editorSub!: Subscription;

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.editorSub = this.noteService.editorAberto$.subscribe((statusbar) => {
      this.isEditorOpen = statusbar;
    });
  }

  ngOnDestroy(): void {
    if (this.editorSub) {
      this.editorSub.unsubscribe();
    }
  }
}
