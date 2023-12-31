import { KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogActions } from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'app-form-modal',
  template: `
    <header>
      <h2 mat-dialog-title>{{ title }}</h2>
    </header>
    <section>
      <form [formGroup]="formGroup" (ngSubmit)="save.emit(); close.emit()">
        @for (control of formGroup.controls | keyvalue; track control.key){
          <div>
            <mat-form-field class="example-form-field">
              <mat-label>{{ control.key }}</mat-label>
              <input 
                matInput type="text"
                [id]="control.key"
                type="text"
                [formControlName]="control.key"
              >
            </mat-form-field>
          </div>
        }
        <mat-dialog-actions class="dialog-actions">
          <button mat-raised-button color="primary" type="submit">Save</button>
          <button mat-raised-button color="warn" (click)="close.emit()">close</button>
        </mat-dialog-actions>
      </form>
    </section>
  `,
  styles: [
    `
      .dialog-actions {
        display: flex;
        justify-content: space-between;
      }
    `
  ],
  imports: [ReactiveFormsModule, KeyValuePipe, MatDialogActions, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
})
export class FormModalComponent {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) title!: string;
  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}