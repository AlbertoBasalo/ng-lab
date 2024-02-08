import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  Signal,
  WritableSignal,
  computed,
  input,
  signal,
} from '@angular/core';
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
      <input
        type="number"
        name="newParticipants"
        [ngModel]="newParticipants()"
        (ngModelChange)="onNewParticipantsChange($event)"
        min="0"
        [max]="maxNewParticipants()"
      />
    } @else {
      <div>
        <button class="secondary outline" (click)="onNewParticipantsChange(0)">Reset</button>
        <span>No more places available</span>
      </div>
    }
    <button
      [disabled]="bookingSaved() || newParticipants() === 0"
      (click)="onBookParticipantsClick()"
    >
      Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
    </button>
    <div>{{ bookedMessage() }}</div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingFormComponent {
  // input division
  activity = input.required<Activity>();
  alreadyParticipants = input.required<number>();
  remainingPlaces = input.required<number>();
  bookingSaved = input.required<boolean>();

  // signal division
  newParticipants: WritableSignal<number> = signal(0);

  // computed division
  bookingAmount: Signal<number> = computed(() => this.newParticipants() * this.activity().price);
  bookedMessage: Signal<string> = computed(() =>
    this.bookingSaved() ? `Booked USD ${this.bookingAmount()}` : '',
  );
  maxNewParticipants: Signal<number> = computed(
    () => this.activity().maxParticipants - this.alreadyParticipants(),
  );

  // output division
  @Output() saveBooking = new EventEmitter<Booking>();
  @Output() changeParticipants = new EventEmitter<number>();

  // event division
  onNewParticipantsChange(newParticipants: number) {
    if (newParticipants > this.maxNewParticipants()) {
      newParticipants = this.maxNewParticipants();
    }
    this.newParticipants.set(newParticipants);
    this.changeParticipants.emit(newParticipants);
  }
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
