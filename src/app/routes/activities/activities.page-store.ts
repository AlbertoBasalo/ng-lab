import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { PageStore } from '@shared/services/page.store';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesPageStore extends PageStore {
  // Injection division
  readonly service = inject(ActivitiesService);

  // State division
  #getActivitiesState = this.addState<Activity[]>([]);

  // Selectors division
  activities = computed(() => this.#getActivitiesState().result);
  getActivitiesStage = computed(() => this.#getActivitiesState().stage);

  // Data division
  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(switchMap((filter) => this.service.getActivitiesByFilter$(filter)));

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Find and book an activity');
    this.dispatch(this.#activitiesByFilter$, this.#getActivitiesState);
  }

  // Commands division
  getActivitiesBySearchTerm(searchTerm: string) {
    /** Notify the filter term to search for */
    this.#searchTerm$.next(searchTerm);
  }
}
