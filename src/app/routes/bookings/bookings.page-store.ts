import { Injectable, Injector, computed, effect, inject } from '@angular/core';
import { connectCommandToSignal, createCommandSignal } from '@shared/services/command.state';
import { ActivityBooking } from './activity-booking.type';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsPageStore {
  // Injection division
  readonly #service = inject(BookingsService);
  readonly #injector = inject(Injector);

  // State division
  #getBookingsState = createCommandSignal<ActivityBooking[]>([]);
  #cancelBookingState = createCommandSignal<boolean>(false);

  // Selectors division
  bookings = computed(() => this.#getBookingsState().result);
  getBookingsStage = computed(() => this.#getBookingsState().stage);
  cancelBookingStage = computed(() => this.#cancelBookingState().stage);

  constructor() {
    effect(() => this.#reloadAfterCancel(), { allowSignalWrites: true });
  }

  // Commands division
  getBookings() {
    connectCommandToSignal(this.#service.getBookings$(), this.#getBookingsState, this.#injector);
  }
  cancelBooking(id: number) {
    connectCommandToSignal(this.#service.cancelBooking$(id), this.#cancelBookingState, this.#injector);
  }

  // Effects division
  #reloadAfterCancel() {
    if (this.cancelBookingStage() === 'success') {
      this.getBookings();
    }
  }
}
