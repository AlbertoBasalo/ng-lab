import { Injectable, Injector, effect, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { PageStore } from '@shared/services/page.store';
import { ActivityService } from '../activity.service';
import { ActivityStore } from '../activity.store';

@Injectable()
export class ActivitySlugAdminPageStore extends PageStore {
  readonly #service = inject(ActivityService);
  readonly #activityStore = inject(ActivityStore);

  // State division
  #getActivityState = this.addState<Activity>(NULL_ACTIVITY);
  #getBookingsState = this.addState<Booking[]>([]);

  constructor(injector: Injector) {
    super(injector);
    effect(
      () => {
        if (this.#getActivityState().stage === 'success') {
          this.#activityStore.setActivity(this.activity());
        }
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        if (this.#getBookingsState().stage === 'success') {
          this.#activityStore.setBookings(this.bookings());
        }
      },
      { allowSignalWrites: true },
    );
  }

  activity = this.#activityStore.activity;
  bookings = this.#activityStore.bookings;
  participants = this.#activityStore.participants;

  // Commands division
  getActivityBySlug(slug: string) {
    if (this.activity().id > 0) return;
    this.dispatch(this.#service.getActivityBySlug$(slug), this.#getActivityState);
  }
  getParticipantsByActivityId(activityId: number) {
    if (this.bookings().length > 0) return;
    this.dispatch(this.#service.getBookingsByActivityId$(activityId), this.#getBookingsState);
  }
}
