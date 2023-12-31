import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChecklistItem, RemoveChecklistItem } from '../../shared/interfaces/checklist-item';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
  selector: 'app-checklist-item-list',
  template: `
    <section>
      <ul>
        @for (item of checklistItems; track item.id){
        <li>
          <div>
            @if (item.checked){
                <span>✅</span>
            }
            {{ item.title }}
          </div>
          <div>
            <button mat-raised-button color="primary"(click)="toggle.emit(item.id)">Toggle</button>
            <button mat-raised-button color="accent" (click)="edit.emit(item)">Edit</button>
            <button mat-raised-button color="warn" (click)="delete.emit(item.id)">Delete</button>
          </div>
        </li>
        } @empty {
        <div>
          <h2>Add an item</h2>
          <p>Click the add button to add your first item to this quicklist</p>
        </div>
        }
      </ul>
    </section>
  `,
  imports: [MatButtonModule],
})
export class ChecklistItemListComponent {
  @Input({ required: true }) checklistItems!: ChecklistItem[];
  @Output() toggle = new EventEmitter<RemoveChecklistItem>();
  @Output() delete = new EventEmitter<RemoveChecklistItem>();
  @Output() edit = new EventEmitter<ChecklistItem>();
}