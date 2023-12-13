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
  #getActivityStatus = this.addNewStatus<Activity>(NULL_ACTIVITY);
  #postBookingStatus = this.addNewStatus<Booking>(NULL_BOOKING);

  // Selectors division
  getActivityStatus = computed(() => this.#getActivityStatus().status);
  getActivity = computed(() => this.#getActivityStatus().result);
  postBookingStatus = computed(() => this.#postBookingStatus().status);

  constructor(injector: Injector) {
    super(injector);
  }

  // Commands division
  getActivityBySlug(slug: string) {
    this.connectSourceToStatus(this.#service.getActivityBySlug$(slug), this.#getActivityStatus);
  }
  postBookActivity$(activity: Activity) {
    this.connectSourceToStatus(this.#service.postBookActivity$(activity), this.#postBookingStatus);
  }
}
