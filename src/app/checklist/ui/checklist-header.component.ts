import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist, RemoveChecklist } from '../../shared/interfaces/checklist';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
  selector: 'app-checklist-header',
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h1>
        {{ checklist.title }}
      </h1>
      <div>
        <button mat-raised-button (click)="resetChecklist.emit(checklist.id)">Reset</button>
        <button mat-raised-button (click)="addItem.emit()">Add item</button>
      </div>
    </header>
  `,
  imports: [RouterLink, MatButtonModule],
})
export class ChecklistHeaderComponent {
  @Input({ required: true }) checklist!: Checklist;
  @Output() addItem = new EventEmitter<void>();
  @Output() resetChecklist = new EventEmitter<RemoveChecklist>();
}
