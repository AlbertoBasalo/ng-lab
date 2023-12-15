import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { PageStore } from '@shared/services/page.store';
import { ActivityService } from './activity.service';

@Injectable({ providedIn: 'root' })
export class ActivitySlugPageStore extends PageStore {
  // Injection division
  readonly #service = inject(ActivityService);
  readonly #authStore = inject(AuthStore);
  // State division
  #getActivityState = this.addState<Activity>(NULL_ACTIVITY);
  #getBookingsState = this.addState<Booking[]>([]);

  // Selectors division
  activity = computed(() => this.#getActivityState().result);
  bookings = computed(() => this.#getBookingsState().result);
  participants = computed(() => this.bookings().reduce((acc, booking) => acc + booking.participants, 0));
  isOwner = computed(() => this.activity().userId === this.#authStore.user().id);
  getActivityStage = computed(() => this.#getActivityState().stage);
  availablePlaces = computed(() => this.activity().maxParticipants - this.participants());
  availableText = computed(() => {
    if (this.participants() === 0) {
      return 'Be the first to enroll.';
    }
    if (this.availablePlaces() === 0) {
      return 'Activity sold out. Wait for the next.';
    }
    return `There are ${this.availablePlaces()} available places.`;
  });
  isBookable = computed(
    () => ['published', 'confirmed'].includes(this.activity().status) && this.availablePlaces() > 0,
  );

  constructor(injector: Injector) {
    super(injector);
  }

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
