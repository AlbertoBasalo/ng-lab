import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';

/**
 * Component for the booking form
 * Uses the CurrencyPipe to format the booking amount and FormsModule for the ngModel
 * Receives the activity, the alreadyParticipants and the remainingPlaces as inputs
 * Emits the saveBooking event with the new booking as output
 * Uses the newParticipants as model shared with the parent component
 */
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
    <button [disabled]="newParticipants() === 0" (click)="onBookParticipantsClick()">
      Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
    </button>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent {
  // * Input signals division

  /** The activity being booked*/
  activity = input.required<Activity>();
  /** Number of participants already booked to limit the new ones*/
  alreadyParticipants = input.required<number>();
  /** Number of remaining places to hide the form when cero*/
  remainingPlaces = input.required<number>();

  // * Model (input/output) signals division

  /** Number of participants sync with parent and with input element*/
  newParticipants = model<number>(0);

  // * Output signals division

  /** Emits when the user wants to save the booking*/
  saveBooking = output<Booking>();

  // * Computed signals division

  /** The amount to be paid for the new booking*/
  bookingAmount: Signal<number> = computed(() => this.newParticipants() * this.activity().price);
  /** The maximum number of new participants that can be booked*/
  maxNewParticipants: Signal<number> = computed(() => this.activity().maxParticipants - this.alreadyParticipants());

  // * Event division

  /**
   * When the user clicks on the book button
   * Creates a new booking and emits the saveBooking event
   */
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
    this.saveBooking.emit(newBooking);
  }
}
