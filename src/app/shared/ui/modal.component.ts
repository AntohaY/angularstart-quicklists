import { MatDialogContent } from '@angular/material/dialog';

import {
  Component,
  ContentChild,
  Input,
  TemplateRef,
  inject,
} from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  standalone: true,
  selector: 'app-modal',
  imports: [MatDialogContent],
  template: `<mat-dialog-content class="mat-typography"></mat-dialog-content>`,
})
export class ModalComponent {
  dialog = inject(Dialog);

  @Input() set isOpen(value: boolean) {
    if (value) {
      this.dialog.open(this.template, { panelClass: 'dialog-container' });
    } else {
      this.dialog.closeAll();
    }
  }

  @ContentChild(TemplateRef, { static: false }) template!: TemplateRef<any>;
}