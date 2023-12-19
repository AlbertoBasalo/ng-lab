import { Injectable, Injector, computed, inject } from '@angular/core';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { NewBookingService } from './new-booking.service';

@Injectable()
export class NewBookingStore {
  // Injection division
  readonly #service = inject(NewBookingService);
  readonly #injector = inject(Injector);

  // State division
  #postBookingState = createCommandState<Booking>(NULL_BOOKING);

  // Selectors division
  postBookingStage = computed(() => this.#postBookingState().stage);
  postBookingError = computed(() => this.#postBookingState().error);
  postBookingResult = computed(() => this.#postBookingState().result);

  // Commands division
  postBooking(booking: Partial<Booking>) {
    connectCommandState(this.#service.postBooking$(booking), this.#postBookingState, this.#injector);
  }
}
