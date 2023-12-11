import { ChangeDetectionStrategy, Component, Injector, computed, effect, inject } from '@angular/core';
import { connect, createSignal } from '@shared/services/command.signal';
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
    @switch (getBookingsStatus()) {
      @case ('pending') {
        <lab-pending message="Loading bookings" />
      }
      @case ('error') {
        <lab-error message="Could not load bookings" />
      }
      @default {
        <lab-bookings [bookings]="getBookingsResult()" (cancel)="onCancel($event)" />
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

  #getBookings = createSignal<ActivityBooking[]>([]);
  #cancelBooking = createSignal<unknown>(null);

  // template division

  getBookingsResult = computed(() => this.#getBookings().result);
  getBookingsStatus = computed(() => this.#getBookings().status);
  cancelBookingStatus = computed(() => this.#cancelBooking().status);

  constructor() {
    connect(this.#service.getBookings$(), this.#getBookings);
    effect(() => this.reloadAfterCancel(), { allowSignalWrites: true });
  }

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
