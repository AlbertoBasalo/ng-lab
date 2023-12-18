import { Injectable, Injector, computed, effect, inject, signal } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { connectCommandToSignal, createCommandSignal } from '@shared/services/command.state';
import { ActivityService } from './activity.service';

@Injectable({ providedIn: 'root' })
export class ActivitySlugStore {
  // Injection division
  readonly #service = inject(ActivityService);
  readonly #authStore = inject(AuthStore);

  // State division
  #getActivityState = createCommandSignal<Activity>(NULL_ACTIVITY);
  #getBookingsState = createCommandSignal<Booking[]>([]);
  #slugState = signal<string>('');

  // Selectors division
  getActivityStage = computed(() => this.#getActivityState().stage);
  getBookingsStage = computed(() => this.#getBookingsState().stage);
  activity = computed(() => this.#getActivityState().result);
  isOwner = computed(() => this.activity().userId === this.#authStore.user().id);
  bookings = computed(() => this.#getBookingsState().result);
  participants = computed(() =>
    this.bookings().reduce((acc: number, booking: Booking) => acc + booking.participants, 0),
  );
  availablePlaces = computed(() => this.activity().maxParticipants - this.participants());
  title = computed(() => this.activity().name || this.#slugState());

  constructor(private injector: Injector) {
    effect(
      () => {
        if (this.#slugState() !== '') this.#getActivityBySlug(this.#slugState());
      },
      { allowSignalWrites: true },
    );
    effect(
      () => {
        if (this.getActivityStage() === 'success') this.#getParticipantsByActivityId(this.activity().id);
      },
      { allowSignalWrites: true },
    );
  }

  // Commands division
  setSlug(slug: string) {
    this.#slugState.set(slug);
  }
  #getActivityBySlug(slug: string) {
    connectCommandToSignal(this.#service.getActivityBySlug$(slug), this.#getActivityState, this.injector);
  }
  #getParticipantsByActivityId(activityId: number) {
    connectCommandToSignal(this.#service.getBookingsByActivityId$(activityId), this.#getBookingsState, this.injector);
  }
}
