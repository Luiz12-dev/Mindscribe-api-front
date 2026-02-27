import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note';
import { FormsModule } from '@angular/forms';

interface NoteVisual {
  id: string;
  title: string;
  content: string;
  time: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  notas: any[] = [];
}
