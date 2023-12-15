import { Injectable, Injector, inject } from '@angular/core';
import { PageStore } from '@shared/services/page.store';
import { ActivityStore } from '../activities.store';

@Injectable()
export class ActivitySlugAdminPageStore extends PageStore {
  readonly #activityStore = inject(ActivityStore);

  constructor(injector: Injector) {
    super(injector);
  }

  activity = this.#activityStore.activity;
  bookings = this.#activityStore.bookings;
  participants = this.#activityStore.participants;
}
