import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { getNextActivityStatus } from '@domain/activity.functions';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { toSignalMap } from 'src/app/shared/api/signal.functions';
import { ActivityHeaderComponent } from './activity-header.component';
import { BookingFormComponent } from './booking-form.component';
import { BookingsService } from './bookings.service';
import { ParticipantsComponent } from './participants.component';

@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
  imports: [ActivityHeaderComponent, ParticipantsComponent, BookingFormComponent],
  template: `
    @if (activity(); as activity) {
      <article>
        <header>
          <lab-activity-header [activity]="activity" [activityStatus]="activityStatus()" />
        </header>
        <main>
          <lab-participants
            [activity]="activity"
            [alreadyParticipants]="alreadyParticipants()"
            [remainingPlaces]="remainingPlaces()"
            [newParticipants]="newParticipants()"
            [totalParticipants]="totalParticipants()" />
        </main>
        <footer>
          @if (isBookable()) {
            <lab-booking-form
              [activity]="activity"
              [(newParticipants)]="newParticipants"
              (saveBookingChange)="postBooking($event)"
              [alreadyParticipants]="alreadyParticipants()"
              [remainingPlaces]="remainingPlaces()"
              [bookingSaved]="bookingSaved()" />
          }
        </footer>
      </article>
    }
  `,
})
export default class BookingsPage {
  // * Injected services division

  #service = inject(BookingsService);

  // * Input signals division

  /** The slug of the activity that comes from the router */
  slug: Signal<string | undefined> = input<string>();

  // * Signals division

  bookingSaved: WritableSignal<boolean> = signal(false);
  newParticipants: WritableSignal<number> = signal(0);

  // * Computed signals division

  /** The activity that comes from the API based on the slug signal */
  activity: Signal<Activity> = toSignalMap(this.slug, (slug) => this.#service.getActivityBySlug$(slug), NULL_ACTIVITY);
  /** The bookings of the activity that comes from the API based on the activity signal */
  activityBookings: Signal<Booking[]> = toSignalMap(
    this.activity,
    (activity) => this.#service.getBookingsByActivityId$(activity.id),
    [],
  );

  /** The sum of participants of the bookings of the activity */
  alreadyParticipants: Signal<number> = computed(() =>
    this.activityBookings().reduce((acc, booking) => acc + booking.participants, 0),
  );

  /** Already booked plus new participants */
  totalParticipants: Signal<number> = computed(() => this.alreadyParticipants() + this.newParticipants());

  /** Activity status computed from current activity and total participants */
  activityStatus: Signal<ActivityStatus> = computed(() =>
    getNextActivityStatus(this.activity(), this.totalParticipants()),
  );

  /** If the activity has an status bookable */
  isBookable: Signal<boolean> = computed(() => ['published', 'confirmed'].includes(this.activity().status));

  /** Remaining places to book */
  remainingPlaces: Signal<number> = computed(() => this.activity().maxParticipants - this.totalParticipants());

  // * Methods division

  /** Post a new booking to the API and update the activity status if it is necessary */
  postBooking(newBooking: Booking | undefined) {
    if (newBooking === undefined) return;
    this.#service.postBooking$(newBooking).subscribe({
      next: () => {
        this.bookingSaved.set(true);
        this.#service.updateActivityStatus$(this.activity(), this.activityStatus()).subscribe();
      },
      error: (error) => console.error('Error creating booking', error),
    });
  }
}
