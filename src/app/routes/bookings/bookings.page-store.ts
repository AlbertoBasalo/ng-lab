import { Injectable, Injector, computed, inject } from '@angular/core';
import { PageStore } from '@shared/services/page.store';
import { ActivityBooking } from './activity-booking.type';
import { BookingsService } from './bookings.service';

@Injectable()
export class BookingsPageStore extends PageStore {
  // Injection division
  readonly #service = inject(BookingsService);

  // State division
  #getBookingsStatus = this.addNewStatus<ActivityBooking[]>([]);
  #cancelBookingStatus = this.addNewStatus<boolean>(false);

  // Selectors division
  bookings = computed(() => this.#getBookingsStatus().result);
  bookingsStatus = computed(() => this.#getBookingsStatus().status);
  cancelBookingStatus = computed(() => this.#cancelBookingStatus().status);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Your activity bookings');
  }

  // Commands division
  getBookings() {
    this.connectSourceToStatus(this.#service.getBookings$(), this.#getBookingsStatus);
  }
  cancelBooking(id: number) {
    this.connectSourceToStatus(this.#service.cancelBooking$(id), this.#cancelBookingStatus);
  }
}
