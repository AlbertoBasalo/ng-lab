import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { PageTemplate } from '@shared/ui/page.template';
import { BookingsList } from './bookings.list';
import { BookingsPageStore } from './bookings.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, BookingsList],
  providers: [BookingsPageStore],
  template: `
    <lab-page [store]="store">
      @if (bookingsStatus() === 'success') {
        <lab-bookings [bookings]="bookings()" (cancel)="onCancel($event)" />
      }
    </lab-page>
  `,
})
export default class BookingsPage {
  // Injection division
  readonly store = inject(BookingsPageStore);

  // Data division
  bookings = this.store.bookings;
  bookingsStatus = this.store.bookingsStatus;
  cancelStatus = this.store.cancelBookingStatus;

  // Life-cycle division
  constructor() {
    this.store.getBookings();
    effect(() => this.#reloadAfterCancel(), { allowSignalWrites: true });
  }

  // Event handlers division
  onCancel(bookingId: number) {
    this.store.cancelBooking(bookingId);
  }

  // Effects division
  #reloadAfterCancel() {
    if (this.cancelStatus() === 'success') {
      this.store.getBookings();
    }
  }
}
