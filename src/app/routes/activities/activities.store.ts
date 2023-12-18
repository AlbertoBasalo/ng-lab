import { Injectable, Injector, computed, inject } from '@angular/core';
import { convertToCommandState } from '@shared/services/command.state';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesPageStore {
  // Injection division
  readonly #service = inject(ActivitiesService);
  readonly #injector = inject(Injector);

  // Data division
  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(switchMap((filter) => this.#service.getActivitiesByFilter$(filter)));

  // State division
  #getActivitiesState = convertToCommandState(this.#activitiesByFilter$, [], this.#injector);

  // Selectors division
  activities = computed(() => this.#getActivitiesState().result);
  getActivitiesStage = computed(() => this.#getActivitiesState().stage);

  // Commands division
  getActivitiesBySearchTerm(searchTerm: string) {
    /** Notify the filter term to search for */
    this.#searchTerm$.next(searchTerm);
  }
}
