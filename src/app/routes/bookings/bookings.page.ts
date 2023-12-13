import { ChangeDetectionStrategy, Component, Injector, computed, effect, inject } from '@angular/core';
import { connect } from '@shared/services/command.signal';
import { PageStore } from '@shared/services/page.store';
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
    <lab-page title="Your activity bookings" [status]="status">
      @if (getBookingsStatus().status === 'success') {
        <lab-bookings [bookings]="getBookingsResult()" (cancel)="onCancel($event)" />
      }
    </lab-page>
  `,
})
export default class BookingsPage {
  // injection division

  #service = inject(BookingsService);
  #injector = inject(Injector);
  #store = inject(PageStore);

  // component data division

  #getBookings = this.#store.createSignal<ActivityBooking[]>([]);
  #cancelBooking = this.#store.createSignal<unknown>(null);

  // template division

  getBookingsResult = computed(() => this.#getBookings().result);
  getBookingsStatus = computed(() => this.#getBookings());
  status = this.#store.commandStatus;

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
