import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageTemplate } from '@shared/ui/page.template';
import { WorkingComponent } from '@shared/ui/working.component';
import { BookingsList } from './bookings.list';
import { BookingsStore } from './bookings.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, BookingsList, WorkingComponent],
  providers: [BookingsStore],
  template: `
    <lab-page [title]="title">
      @if (getBookingsStage() === 'success') {
        <lab-bookings [bookings]="bookings" (cancel)="onCancel($event)" />
      } @else if (getBookingsStage() === 'working') {
        <lab-working />
      }
    </lab-page>
  `,
})
export default class BookingsPage {
  // Injection division
  readonly #store = inject(BookingsStore);

  // Data division
  bookings = this.#store.bookings;
  getBookingsStage = this.#store.getBookingsStage;
  cancelBookingStage = this.#store.cancelBookingStage;
  title = 'Your activity bookings';

  // Life-cycle division
  constructor() {
    this.#store.getBookings();
  }

  // Event handlers division
  onCancel(bookingId: number) {
    this.#store.cancelBooking(bookingId);
  }
}
