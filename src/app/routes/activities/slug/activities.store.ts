import { Injectable, computed, signal } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';

export type ActivityWithBookings = {
  activity: Activity;
  bookings: Booking[];
};

@Injectable({ providedIn: 'root' })
export class ActivityStore {
  #state = signal<ActivityWithBookings>({
    activity: NULL_ACTIVITY,
    bookings: [],
  });

  activity = computed(() => this.#state().activity);
  bookings = computed(() => this.#state().bookings);
  participants = computed(() => this.bookings().reduce((acc, booking) => acc + booking.participants, 0));

  setActivity(activity: Activity) {
    console.log('ActivityStore.setActivity', activity);
    this.#state.update((state) => ({ ...state, activity }));
  }

  setBookings(bookings: Booking[]) {
    console.log('ActivityStore.setBookings', bookings);
    this.#state.update((state) => ({ ...state, bookings }));
  }
}
