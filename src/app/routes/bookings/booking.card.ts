import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivityBooking } from './activity-booking.type';

@Component({
  selector: 'lab-booking-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  template: `
    <article class="booking">
      <header>
        <h3>{{ booking.activity.name }}</h3>
      </header>
      <p>{{ booking.activity.date }}</p>
      <p>{{ booking.participants }}</p>
      <p>{{ booking.activity.price }}</p>
      <p>{{ booking.participants * booking.activity.price }}</p>
      <footer>
        <button (click)="onCancelClick(booking.id)">Cancel</button>
      </footer>
    </article>
  `,
})
export class BookingCard {
  @Input({ required: true }) booking!: ActivityBooking;
  @Output() cancel = new EventEmitter<number>();
  onCancelClick(id: number) {
    this.cancel.emit(id);
  }
}
