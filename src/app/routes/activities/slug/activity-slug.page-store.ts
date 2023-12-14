import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { PageStore } from '@shared/services/page.store';
import { ActivitySlugService } from './activity-slug.service';

@Injectable()
export class ActivitySlugPageStore extends PageStore {
  // Injection division
  readonly #service = inject(ActivitySlugService);

  // State division
  #getActivityState = this.addNewState<Activity>(NULL_ACTIVITY);
  #postBookingState = this.addNewState<Booking>(NULL_BOOKING);

  // Selectors division
  getActivityStage = computed(() => this.#getActivityState().stage);
  activity = computed(() => this.#getActivityState().result);
  postBookingStage = computed(() => this.#postBookingState().stage);

  constructor(injector: Injector) {
    super(injector);
  }

  // Commands division
  getActivityBySlug(slug: string) {
    this.connectCommandToState(this.#service.getActivityBySlug$(slug), this.#getActivityState);
  }
  postBookActivity$(activity: Activity) {
    this.connectCommandToState(this.#service.postBookActivity$(activity), this.#postBookingState);
  }
}
