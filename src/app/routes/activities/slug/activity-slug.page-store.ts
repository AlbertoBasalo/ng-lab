import { Injectable, Injector, computed, effect, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { PageStore } from '@shared/services/page.store';
import { ActivityStore } from './activities.store';
import { ActivitySlugService } from './activity-slug.service';

@Injectable()
export class ActivitySlugPageStore extends PageStore {
  // Injection division
  readonly #service = inject(ActivitySlugService);
  readonly #activityStore = inject(ActivityStore);
  readonly #authStore = inject(AuthStore);
  // State division
  #getActivityState = this.addState<Activity>(NULL_ACTIVITY);
  #getBookingsState = this.addState<Booking[]>([]);

  // Selectors division
  activity = computed(() => this.#getActivityState().result);
  bookings = computed(() => this.#getBookingsState().result);
  participants = this.#activityStore.participants;
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
    effect(
      () => {
        if (this.getActivityStage() === 'success') {
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

  // Commands division
  getActivityBySlug(slug: string) {
    this.dispatch(this.#service.getActivityBySlug$(slug), this.#getActivityState);
  }
  getBookingsByActivityId(activityId: number) {
    this.dispatch(this.#service.getBookingsByActivityId$(activityId), this.#getBookingsState);
  }
  getParticipantsByActivityId(activityId: number) {
    this.getBookingsByActivityId(activityId);
  }
}
