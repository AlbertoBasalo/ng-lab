import { ChangeDetectionStrategy, Component, Injector, computed, effect, inject } from '@angular/core';
import { connectSignal } from '@shared/services/command.signal';
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
    <lab-page [store]="store">
      @if (getBookingsStatus() === 'success') {
        <lab-bookings [bookings]="getBookingsResult()" (cancel)="onCancel($event)" />
      }
    </lab-page>
  `,
})
export default class BookingsPage {
  // Injection division
  readonly #injector = inject(Injector);
  readonly #service = inject(BookingsService);
  readonly store = inject(PageStore);

  // Data division
  #getBookings = this.store.addNewStatusSignal<ActivityBooking[]>([]);
  getBookingsResult = computed(() => this.#getBookings().result);
  getBookingsStatus = computed(() => this.#getBookings().status);
  #cancelBooking = this.store.addNewStatusSignal<unknown>(null);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Your activity bookings');
    connectSignal(this.#service.getBookings$(), this.#getBookings);
    effect(() => this.#reloadAfterCancel(), { allowSignalWrites: true });
  }

  // Event handlers division
  onCancel(id: number) {
    connectSignal(this.#service.cancelBooking$(id), this.#cancelBooking, this.#injector);
  }

  // Effect handlers division
  #reloadAfterCancel() {
    if (this.#cancelBooking().status === 'success') {
      connectSignal(this.#service.getBookings$(), this.#getBookings, this.#injector);
    }
  }
}
