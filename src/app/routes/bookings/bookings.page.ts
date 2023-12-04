import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toState } from '@shared/services/state.signal';
import { BookingsList } from './bookings.list';
import { BookingsService } from './bookings.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingsList],
  providers: [BookingsService],
  template: ` <lab-bookings
    [bookings]="bookings()"
    (cancel)="onCancel($event)"
  />`,
})
export default class BookingsPage {
  // injection division
  #service = inject(BookingsService);

  // component data division
  #getBookingsState = toState(this.#service.getBookings$(), []);

  // template division
  bookings = computed(() => this.#getBookingsState().value);

  // template event handlers
  onCancel(id: number) {
    console.log('cancel', id);
  }
}
