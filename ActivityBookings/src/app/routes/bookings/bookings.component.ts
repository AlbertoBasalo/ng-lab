import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  effect,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity, NULL_ACTIVITY } from '../../domain/activity.type';
import { Booking } from '../../domain/booking.type';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, FormsModule],
  template: `
    <article>
      <header>
        <h2>{{ activity().name }} at {{ activity().location }}</h2>
        <div>
          <span>{{ activity().price | currency }}</span>
          <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
          <span [class]="activity().status">{{ activity().status | uppercase }}</span>
        </div>
      </header>
      <main>
        <h4>Participants</h4>
        <div>Already Participants: {{ alreadyParticipants() }}</div>
        <div>Max Participants: {{ activity().maxParticipants }}</div>
        <ul>
          <li>New Participants: {{ newParticipants() }}</li>
          <li>Remaining places: {{ remainingPlaces() }}</li>
          <li>Total participants: {{ totalParticipants() }}</li>
        </ul>
        <div>
          @for (participant of participants(); track participant.id) {
            <span [attr.data-tooltip]="participant.id">🏃</span>
          } @empty {
            <span>🕸️</span>
          }
        </div>
      </main>
      <footer>
        @if (isBookable()) {
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
            [disabled]="booked() || newParticipants() === 0"
            (click)="onBookParticipantsClick()"
          >
            Book {{ newParticipants() }} places now for {{ bookingAmount() | currency }}!
          </button>
          <div>{{ bookedMessage() }}</div>
        }
      </footer>
    </article>
  `,
  styles: `
    .draft {
      color: aqua;
      font-style: italic;
    }
    .published {
      color: navy;
    }
    .confirmed {
      color: green;
    }
    .sold-out {
      color: teal;
      font-style: italic;
    }
    .done {
      color: olive;
      font-style: italic;
    }
    .cancelled {
      color: maroon;
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookingsComponent {
  // input division
  activity = input<Activity>(NULL_ACTIVITY);
  alreadyParticipants = input(0);
  booked = input(false);
  newParticipants = signal(0);

  // output division
  @Output() book = new EventEmitter<Booking>();
  @Output() changeParticipants = new EventEmitter<number>();

  // signal division
  participants = signal<{ id: number }[]>([]);

  // computed division
  maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
  isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));
  totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
  remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
  bookingAmount = computed(() => this.newParticipants() * this.activity().price);
  bookedMessage = computed(() => (this.booked() ? `Booked USD ${this.bookingAmount()}` : ''));

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#changeStatusOnTotalParticipants(), ALLOW_WRITE);
  }

  #changeStatusOnTotalParticipants() {
    const totalParticipants = this.totalParticipants();
    this.changeParticipants.emit(totalParticipants);
    this.participants.update((participants) => {
      participants.splice(0, participants.length);
      for (let i = 0; i < totalParticipants; i++) {
        participants.push({ id: participants.length + 1 });
      }
      return participants;
    });
  }

  onNewParticipantsChange(newParticipants: number) {
    if (newParticipants > this.maxNewParticipants()) {
      newParticipants = this.maxNewParticipants();
    }
    this.newParticipants.set(newParticipants);
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
    this.book.emit(newBooking);
  }
}
