import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  computed,
  inject,
} from '@angular/core';
import { connect, createState } from '@shared/services/state.signal';
import { ActivityBooking } from './activity-booking.type';
import { BookingsList } from './bookings.list';
import { BookingsService } from './bookings.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingsList],
  providers: [BookingsService],
  template: `
    @if (bookingsStatus() === 'success') {
      <lab-bookings [bookings]="bookings()" (cancel)="onCancel($event)" />
    }
    {{ bookingsStatus() }}
  `,
})
export default class BookingsPage {
  // injection division
  #service = inject(BookingsService);
  #injector = inject(Injector);
  // component data division
  #getBookingsState = createState<ActivityBooking[]>([]);
  // template division
  bookings = computed(() => this.#getBookingsState().value);
  bookingsStatus = computed(() => this.#getBookingsState().status);

  constructor() {
    connect(this.#service.getBookings$(), this.#getBookingsState);
  }

  // template event handlers
  onCancel(id: number) {
    connect(
      this.#service.cancelBooking$(id),
      this.#getBookingsState,
      this.#injector,
    );
  }
}
