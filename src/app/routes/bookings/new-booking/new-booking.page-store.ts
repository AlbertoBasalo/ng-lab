import { Injectable, Injector, computed, inject } from '@angular/core';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { PageStore } from '@shared/services/page.store';
import { NewBookingService } from './new-booking.service';

@Injectable()
export class NewBookingPageStore extends PageStore {
  // Injection division
  readonly #service = inject(NewBookingService);

  // State division
  #postBookingState = this.addState<Booking>(NULL_BOOKING);

  // Selectors division
  postBookingStage = computed(() => this.#postBookingState().stage);

  constructor(injector: Injector) {
    super(injector);
  }
  // Commands division
  postBooking$(booking: Partial<Booking>) {
    this.dispatch(this.#service.postBooking$(booking), this.#postBookingState);
  }
}
