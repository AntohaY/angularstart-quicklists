import {  Injectable, computed, effect, inject, signal } from '@angular/core';
import { EMPTY, Subject, catchError, map, merge } from 'rxjs';
import { AddChecklist, Checklist, EditChecklist, RemoveChecklist } from '../interfaces/checklist';
import { StorageService } from './storage.service';
import { ChecklistItemService } from '../../checklist/data-access/checklist-item.service';
import { connect } from 'ngxtension/connect';


export interface ChecklistsState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  storageService = inject(StorageService);
  checklistItemService = inject(ChecklistItemService);
  // state
  private state = signal<ChecklistsState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  private checklistsLoaded$ = this.storageService.loadChecklists().pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );
  // selectors
  
  checklists = computed(() => this.state().checklists);

  loaded = computed(() => this.state().loaded);

  // sources / actions
  add$ = new Subject<AddChecklist>();

  remove$ = this.checklistItemService.checklistRemoved$;

  edit$ = new Subject<EditChecklist>();

  private error$ = new Subject<string>();


  constructor() {
    const nextState$ = merge(
      this.checklistsLoaded$.pipe(
        map((checklists) => ({ checklists, loaded: true }))
      ),
      this.error$.pipe(map((error) => ({ error })))
    );

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, checklist) => ({
        checklists: [...state.checklists, this.addIdToChecklist(checklist)],
      }))
      .with(this.remove$, (state, id) => ({
        checklists: state.checklists.filter((checklist) => checklist.id !== id),
      }))
      .with(this.edit$, (state, update) => ({
        checklists: state.checklists.map((checklist) =>
          checklist.id === update.id
            ? { ...checklist, title: update.data.title }
            : checklist
        ),
      }));

    // effects
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
      }
    });
  }

  private addIdToChecklist(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    // NOTE: This is a simplistic slug generator and will not handle things like special characters.
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    // Check if the slug already exists
    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    // If the title is already being used, add a string to make the slug unique
    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}