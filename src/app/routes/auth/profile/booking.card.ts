import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Booking } from '../../../shared/domain/booking.type';

@Component({
  selector: 'lab-booking-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article [id]="booking.id" class="booking">
      <header>
        <h3>Booked on {{ booking.date | date: 'yyyy/MM/dd' }}</h3>
      </header>
      <p>Reserved for: {{ booking.participants }} participant/s.</p>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingCard {
  @Input({ required: true }) booking!: Booking;
}
