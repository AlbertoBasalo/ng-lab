import { Injectable, Injector, computed, inject } from '@angular/core';

import { Activity } from '@shared/domain/activity.type';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { ActivitiesService } from './activities.service';

@Injectable()
export class ActivitiesPageStore {
  // Injection division
  readonly #service = inject(ActivitiesService);
  readonly #injector = inject(Injector);

  // Data division

  // State division
  #getActivitiesState = createCommandState<Activity[]>([]);

  // Selectors division
  activities = computed(() => this.#getActivitiesState().result);
  getActivitiesStage = computed(() => this.#getActivitiesState().stage);

  constructor() {
    this.getActivitiesBySearchTerm('');
  }

  // Commands division
  getActivitiesBySearchTerm(searchTerm: string) {
    connectCommandState(this.#service.getActivitiesByFilter$(searchTerm), this.#getActivitiesState, this.#injector);
  }
}
