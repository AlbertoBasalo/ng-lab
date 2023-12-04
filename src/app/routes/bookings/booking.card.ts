import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LabelDataComponent } from '@shared/ui/label-data.component';
import { ActivityBooking } from './activity-booking.type';

@Component({
  selector: 'lab-booking-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, LabelDataComponent],
  template: `
    <article class="booking">
      <header>
        <h3>{{ booking.activity.name }}</h3>
      </header>
      <lab-label-data
        label="Date"
        [data]="booking.activity.date | date: 'dd-MMM-yyyy'"
      />
      <lab-label-data label="Participants" [data]="booking.participants" />
      <lab-label-data label="Price" [data]="booking.activity.price" unit="€" />
      <lab-label-data
        label="Total"
        [data]="booking.participants * booking.activity.price"
        unit="€"
      />
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
