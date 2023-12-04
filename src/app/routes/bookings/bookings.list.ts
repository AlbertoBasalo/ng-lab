import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivityBooking } from './activity-booking.type';
import { BookingCard } from './booking.card';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingCard],
  template: `
    <div class="grid">
      @for (booking of bookings; track booking.id) {
        <lab-booking-card [booking]="booking" (cancel)="cancel.next($event)" />
      } @empty {
        <p>No bookings yet</p>
      }
    </div>
  `,
})
export class BookingsList {
  @Input({ required: true }) bookings: ActivityBooking[] = [];
  @Output() cancel = new EventEmitter<number>();
}
