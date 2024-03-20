import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { getNextActivityStatus } from '@domain/activity.functions';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { catchError, switchMap } from 'rxjs';
import { toSignalMap } from 'src/app/shared/api/signal.functions';
import { ActivityHeaderComponent } from './activity-header.component';
import { BookingFormComponent } from './booking-form.component';
import { BookingsService } from './bookings.service';
import { ParticipantsComponent } from './participants.component';

/**
 * Routed component for the Bookings page
 * Uses the ActivityHeaderComponent, ParticipantsComponent and BookingFormComponent for the presentation
 * Uses the BookingsService as facade to get the activities and bookings
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
              (saveBooking)="onSaveBooking($event)"
              [alreadyParticipants]="alreadyParticipants()"
              [remainingPlaces]="remainingPlaces()" />
          }
          <div>{{ bookingSaved() }}</div>
        </footer>
      </article>
    }
  `,
})
export default class BookingsPage {
  // * Injected services division

  /** The service to access the activities and bookings api*/
  #service = inject(BookingsService);

  /** The title service to update the title*/
  #title = inject(Title);
  /** The meta service to update the meta tags*/
  #meta = inject(Meta);

  // * Input signals division

  /** The slug of the activity that comes from the router */
  slug: Signal<string | undefined> = input<string>();

  // * Signals division

  /** A signal with the new participants count sync with the form model*/
  newParticipants: WritableSignal<number> = signal(0);
  /** A signal message changed when a new booking is successfully saved */
  bookingSaved: WritableSignal<string> = signal('');

  // * Computed signals division

  /** The activity that comes from the API based on the slug signal */
  activity: Signal<Activity> = toSignalMap(this.slug, (slug) => this.#service.getActivityBySlug$(slug), NULL_ACTIVITY);
  /** The bookings of the activity that comes from the API based on the activity signal */
  #activityBookings: Signal<Booking[]> = toSignalMap(
    this.activity,
    (activity) => this.#service.getBookingsByActivityId$(activity.id),
    [],
  );

  /** The sum of participants of the bookings of the activity */
  alreadyParticipants: Signal<number> = computed(() =>
    this.#activityBookings().reduce((acc, booking) => acc + booking.participants, 0),
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

  constructor() {
    // Change the title and meta tags based on the activity signal changes
    effect(() => {
      const activity = this.activity();
      this.#title.setTitle(activity.name);
      const description = `${activity.name} at ${activity.location} on ${activity.date} for ${activity.price}€`;
      this.#meta.updateTag({ name: 'description', content: description });
    });
  }

  // * Methods division

  /** Post a new booking to the API and update the activity status if it is necessary */
  onSaveBooking(newBooking: Booking | undefined) {
    if (newBooking === undefined) return;
    // ToDo: use a declarative approach
    this.#service
      .postBooking$(newBooking)
      .pipe(
        catchError((error) => {
          console.error('Error creating booking', error);
          throw error;
        }),
        switchMap(() => this.#service.updateActivityStatus$(this.activity(), this.activityStatus())),
        catchError((error) => {
          console.error('Error updating activity', error);
          throw error;
        }),
      )
      .subscribe(() => this.bookingSaved.set('Booking saved!'));
  }
}
