import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';

@Component({
  selector: 'lab-booking-form',
  standalone: true,
  imports: [CurrencyPipe, FormsModule],
  template: `
    <h4>New Bookings</h4>
    @if (remainingPlaces() > 0) {
      <label for="newParticipants">How many participants want to book?</label>
      <input type="number" name="newParticipants" [(ngModel)]="newParticipants" min="0" [max]="maxNewParticipants()" />
    } @else {
      <div>
        <button class="secondary outline" (click)="newParticipants.set(0)">Reset</button>
        <span>No more places available</span>
      </div>
    }
    <button [disabled]="bookingSaved() || newParticipants() === 0" (click)="onBookParticipantsClick()">
      Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
    </button>
    <div>{{ bookedMessage() }}</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent {
  // * Input signals division

  activity = input.required<Activity>();
  alreadyParticipants = input.required<number>();
  remainingPlaces = input.required<number>();
  bookingSaved = input.required<boolean>();

  // * Model (input/output) signals division

  newParticipants = model<number>(0);
  saveBooking = model<Booking | undefined>();

  // * Computed signals division

  bookingAmount: Signal<number> = computed(() => this.newParticipants() * this.activity().price);
  bookedMessage: Signal<string> = computed(() => (this.bookingSaved() ? `Booked USD ${this.bookingAmount()}` : ''));
  maxNewParticipants: Signal<number> = computed(() => this.activity().maxParticipants - this.alreadyParticipants());

  // * Event division

  onBookParticipantsClick() {
    const newBooking: Booking = {
      id: 0,
      userId: 0,
      activityId: this.activity().id,
      date: new Date(),
      participants: this.newParticipants(),
      payment: {
        method: 'creditCard',
        amount: this.bookingAmount(),
        status: 'pending',
      },
    };
    this.saveBooking.set(newBooking);
  }
}
