import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  effect,
  inject,
} from '@angular/core';
import { connect, createState } from '@shared/services/state.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PendingComponent } from '@shared/ui/pending.component';
import { ActivityBooking } from './activity-booking.type';
import { BookingsList } from './bookings.list';
import { BookingsService } from './bookings.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingsList, PendingComponent, ErrorComponent],
  providers: [BookingsService],
  template: `
    @switch (bookingsStatus()) {
      @case ('pending') {
        <lab-pending message="Loading bookings" />
      }
      @case ('error') {
        <lab-error message="Could not load bookings" />
      }
      @default {
        <lab-bookings [bookings]="bookings()" (cancel)="onCancel($event)" />
        @switch (cancelBookingStatus()) {
          @case ('pending') {
            <lab-pending message="Canceling booking" />
          }
          @case ('error') {
            <lab-error message="Could not cancel booking" />
          }
        }
      }
    }
  `,
})
export default class BookingsPage {
  // injection division
  #service = inject(BookingsService);
  #injector = inject(Injector);
  // component data division
  #getBookingsState = createState<ActivityBooking[]>([]);
  #cancelBookingState = createState<unknown>(null);
  // template division
  bookings = computed(() => this.#getBookingsState().value);
  bookingsStatus = computed(() => this.#getBookingsState().status);
  cancelBookingStatus = computed(() => this.#cancelBookingState().status);
  constructor() {
    connect(this.#service.getBookings$(), this.#getBookingsState);
    effect(() => this.reloadAfterCancel(), { allowSignalWrites: true });
  }

  // template event handlers
  onCancel(id: number) {
    connect(
      this.#service.cancelBooking$(id),
      this.#cancelBookingState,
      this.#injector,
    );
  }

  // effect handlers
  reloadAfterCancel() {
    if (this.#cancelBookingState().status === 'success') {
      connect(
        this.#service.getBookings$(),
        this.#getBookingsState,
        this.#injector,
      );
    }
  }
}
