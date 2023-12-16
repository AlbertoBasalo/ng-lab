import { Injectable, Injector, Signal, computed, effect, inject, signal } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { CommandState, connectCommandToSignal, createCommandSignal } from '@shared/services/command.signal';
import { ActivityService } from './activity.service';

@Injectable({ providedIn: 'root' })
export class ActivitySlugStore {
  // Injection division
  readonly #service = inject(ActivityService);
  readonly #authStore = inject(AuthStore);

  // State division
  #commandsStates: Signal<CommandState<unknown>>[] = [];
  #getActivityState = createCommandSignal<Activity>(NULL_ACTIVITY);
  #getBookingsState = createCommandSignal<Booking[]>([]);
  slug = signal<string>('');

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

  constructor(private injector: Injector) {
    effect(
      () => {
        if (this.slug() !== '') this.#getActivityBySlug(this.slug());
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
  #getActivityBySlug(slug: string) {
    connectCommandToSignal(this.#service.getActivityBySlug$(slug), this.#getActivityState, this.injector);
  }
  #getParticipantsByActivityId(activityId: number) {
    connectCommandToSignal(this.#service.getBookingsByActivityId$(activityId), this.#getBookingsState, this.injector);
  }
}
