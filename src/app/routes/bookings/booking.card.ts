import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LabelDataComponent } from '@shared/ui/label-data.component';
import { ActivityBooking } from './activity-booking.type';

@Component({
  selector: 'lab-booking-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, LabelDataComponent, RouterLink],
  template: `
    <article class="booking">
      <header>
        <h4>
          <a [routerLink]="['/', 'activities', booking.activity.slug]">{{ booking.activity.name }}</a>
        </h4>
      </header>
      <lab-label-data label="Date" [data]="booking.activity.date | date: 'dd-MMM-yyyy'" />
      <lab-label-data label="Participants" [data]="booking.participants" />
      <lab-label-data label="Unit Price" [data]="booking.activity.price" unit="€" />
      <lab-label-data label="Amount" [data]="booking.participants * booking.activity.price" unit="€" />
      <footer>
        <button (click)="onCancelClick(booking.id)">Cancel</button>
      </footer>
    </article>
  `,
})
export class BookingCard {
  // I/O division
  @Input({ required: true }) booking!: ActivityBooking;
  @Output() cancel = new EventEmitter<number>();
  // Event handlers division
  onCancelClick(id: number) {
    this.cancel.emit(id);
  }
}
