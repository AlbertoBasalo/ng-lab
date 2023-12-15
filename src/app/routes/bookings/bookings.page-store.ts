import { Injectable, Injector, computed, inject } from '@angular/core';
import { PageStore } from '@shared/services/page.store';
import { ActivityBooking } from './activity-booking.type';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsPageStore extends PageStore {
  // Injection division
  readonly #service = inject(BookingsService);

  // State division
  #getBookingsState = this.addNewState<ActivityBooking[]>([]);
  #cancelBookingState = this.addNewState<boolean>(false);

  // Selectors division
  bookings = computed(() => this.#getBookingsState().result);
  getBookingsStage = computed(() => this.#getBookingsState().stage);
  cancelBookingStage = computed(() => this.#cancelBookingState().stage);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Your activity bookings');
  }

  // Commands division
  getBookings() {
    this.connectCommandToState(this.#service.getBookings$(), this.#getBookingsState);
  }
  cancelBooking(id: number) {
    this.connectCommandToState(this.#service.cancelBooking$(id), this.#cancelBookingState);
  }
}