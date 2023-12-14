import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityBooking } from './activity-booking.type';
import { BookingCard } from './booking.card';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingCard, RouterLink],
  template: `
    <div class="grid">
      @for (booking of bookings(); track booking.id) {
        <lab-booking-card [booking]="booking" (cancel)="onCancel($event)" />
      } @empty {
        <section>
          <p>You don't have any booking now.</p>
          <p>Go to the <a [routerLink]="['/', 'activities']">activities page</a> and choose one!</p>
        </section>
      }
    </div>
  `,
})
export class BookingsList {
  // I/O division
  @Input({ required: true }) bookings!: Signal<ActivityBooking[]>;
  @Output() cancel = new EventEmitter<number>();
  // Event handlers division
  onCancel(id: number) {
    this.cancel.emit(id);
  }
}
