import { ChangeDetectionStrategy, Component, Injector, computed, effect, inject } from '@angular/core';
import { connect, createSignal } from '@shared/services/command.signal';
import { PageTemplate } from '@shared/ui/page.template';
import { StatusComponent } from '@shared/ui/status.component';
import { ActivityBooking } from './activity-booking.type';
import { BookingsList } from './bookings.list';
import { BookingsService } from './bookings.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, BookingsList, StatusComponent],
  providers: [BookingsService],
  template: `
    <lab-page title="Your activity bookings" [commandStatus]="getBookingsStatus()">
      @if (getBookingsStatus().status === 'success') {
        <lab-bookings [bookings]="getBookingsResult()" (cancel)="onCancel($event)" />
      }
      @if (getBookingsStatus().status === 'success') {
        <footer>
          <lab-status [commandStatus]="cancelBookingStatus()" />
        </footer>
      }
    </lab-page>
  `,
})
export default class BookingsPage {
  // injection division

  #service = inject(BookingsService);
  #injector = inject(Injector);

  // component data division

  #getBookings = createSignal<ActivityBooking[]>([]);
  #cancelBooking = createSignal<unknown>(null);

  // template division

  getBookingsResult = computed(() => this.#getBookings().result);
  getBookingsStatus = computed(() => this.#getBookings());
  cancelBookingStatus = computed(() => this.#cancelBooking());

  constructor() {
    connect(this.#service.getBookings$(), this.#getBookings);
    effect(() => this.reloadAfterCancel(), { allowSignalWrites: true });
  }

  // ToDo: avoid having two command statuses components
  // ? mix both command statuses into one page status
  // ? use a global notification store for command status

  // template event handlers

  onCancel(id: number) {
    connect(this.#service.cancelBooking$(id), this.#cancelBooking, this.#injector);
  }

  // effect handlers

  reloadAfterCancel() {
    if (this.#cancelBooking().status === 'success') {
      connect(this.#service.getBookings$(), this.#getBookings, this.#injector);
    }
  }
}
