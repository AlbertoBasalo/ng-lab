import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivitiesService } from '@api/activities.service';
import { toSignalMap } from '@api/signal.functions';
import { changeActivityStatus } from '@domain/activity.functions';
import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
  imports: [CurrencyPipe, DatePipe, ActivityStatusComponent, FormsModule],
  template: `
    @if (activity(); as activity) {
      <article>
        <header>
          <h2>{{ activity.name }} at {{ activity.location }}</h2>
          <div>
            <span>{{ activity.price | currency }}</span>
            <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
            <lab-activity-status [status]="activity.status" />
          </div>
        </header>
        <main>
          <h4>Participants</h4>
          <div>Already Participants: {{ alreadyParticipants() }}</div>
          <div>Max Participants: {{ activity.maxParticipants }}</div>
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
                <button class="secondary outline" (click)="onNewParticipantsChange(0)">
                  Reset
                </button>
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
    }
  `,
})
export default class BookingsPage {
  #http = inject(HttpClient);
  #activitiesService = inject(ActivitiesService);
  #bookingsUrl = 'http://localhost:3000/bookings';
  slug = input<string>();

  // ToDo:
  // Replace every http with a call to toSignalMap function
  // Create Bookings service
  // Remove async code from effects
  // Rename services to distinguish API from facade
  // Apply container/presenter pattern
  // Refine presenter in nested components (some of them shared)

  activity: Signal<Activity> = toSignalMap(
    this.slug,
    (slug) => this.#activitiesService.getActivityBySlug(slug),
    NULL_ACTIVITY,
  );

  alreadyParticipants = signal(0);
  maxNewParticipants = computed(() => this.activity().maxParticipants - this.alreadyParticipants());
  isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));

  newParticipants = signal(0);
  booked = signal(false);
  participants = signal<{ id: number }[]>([]);

  totalParticipants = computed(() => this.alreadyParticipants() + this.newParticipants());
  remainingPlaces = computed(() => this.activity().maxParticipants - this.totalParticipants());
  bookingAmount = computed(() => this.newParticipants() * this.activity().price);

  bookedMessage = computed(() => {
    if (this.booked()) return `Booked USD ${this.bookingAmount()}`;
    return '';
  });

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#changeStatusOnTotalParticipants(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  #getParticipantsOnActivity() {
    // ! This is a side effect with async code
    const id = this.activity().id;
    if (id === 0) return;
    const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
    this.#http.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #changeStatusOnTotalParticipants() {
    const totalParticipants = this.totalParticipants();
    changeActivityStatus(this.activity(), totalParticipants);
    this.participants.update((participants) => {
      participants.splice(0, participants.length);
      for (let i = 0; i < totalParticipants; i++) {
        participants.push({ id: participants.length + 1 });
      }
      return participants;
    });
  }

  #updateActivityOnBookings() {
    // ! This is a side effect with async code
    if (!this.booked()) return;
    this.#activitiesService
      .putActivity(this.activity())
      .subscribe(() => console.log('Activity status updated'));
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
    this.#http.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error('Error creating booking', error),
    });
  }
}
