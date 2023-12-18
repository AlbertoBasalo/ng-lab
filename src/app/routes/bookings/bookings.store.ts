import { Injectable, Injector, computed, effect, inject } from '@angular/core';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { ActivityBooking } from './activity-booking.type';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsStore {
  // Injection division
  readonly #service = inject(BookingsService);
  readonly #injector = inject(Injector);

  // State division
  #getBookingsState = createCommandState<ActivityBooking[]>([]);
  #cancelBookingState = createCommandState<boolean>(false);

  // Selectors division
  bookings = computed(() => this.#getBookingsState().result);
  getBookingsStage = computed(() => this.#getBookingsState().stage);
  cancelBookingStage = computed(() => this.#cancelBookingState().stage);

  constructor() {
    effect(() => this.#reloadAfterCancel(), { allowSignalWrites: true });
  }

  // Commands division
  getBookings() {
    connectCommandState(this.#service.getBookings$(), this.#getBookingsState, this.#injector);
  }
  cancelBooking(id: number) {
    connectCommandState(this.#service.cancelBooking$(id), this.#cancelBookingState, this.#injector);
  }

  // Effects division
  #reloadAfterCancel() {
    if (this.cancelBookingStage() === 'success') {
      this.getBookings();
    }
  }
}
