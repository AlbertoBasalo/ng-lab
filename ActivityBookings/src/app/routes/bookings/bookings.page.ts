import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Activity, NULL_ACTIVITY } from '../../domain/activity.type';
import { Booking } from '../../domain/booking.type';
import { BookingsComponent } from './bookings.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ``,
  imports: [BookingsComponent],
  template: `
    @if (activity(); as activity) {
      <lab-bookings
        [activity]="activity"
        [alreadyParticipants]="alreadyParticipants()"
        [booked]="booked()"
        (book)="onNewBooking($event)"
        (changeParticipants)="onNewParticipantsChange($event)"
      />
    }
  `,
})
export default class BookingsPage {
  #http$ = inject(HttpClient);
  #activitiesUrl = 'http://localhost:3000/activities';
  #bookingsUrl = 'http://localhost:3000/bookings';

  // input division
  slug = input<string>();

  // signal division
  alreadyParticipants = signal(0);
  booked = signal(false);
  activityStatusUpdated = signal(false);

  // interop division
  activity: Signal<Activity> = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) =>
        this.#http$.get<Activity[]>(`${this.#activitiesUrl}?slug=${slug}`).pipe(
          map((activities) => activities[0] || NULL_ACTIVITY),
          catchError((error) => {
            console.error('Error getting activity', error);
            return of(NULL_ACTIVITY);
          }),
        ),
      ),
    ),
    { initialValue: NULL_ACTIVITY },
  );

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  onNewParticipantsChange(totalParticipants: number) {
    let newStatus = this.activity().status;
    if (totalParticipants >= this.activity().maxParticipants) {
      newStatus = 'sold-out';
    } else if (totalParticipants >= this.activity().minParticipants) {
      newStatus = 'confirmed';
    } else {
      newStatus = 'published';
    }
    if (newStatus === this.activity().status) return;
    this.activity().status = newStatus;
    this.activityStatusUpdated.set(true);
  }

  #getParticipantsOnActivity() {
    const id = this.activity().id;
    if (id === 0) return;
    const bookingsUrl = `${this.#bookingsUrl}?activityId=${id}`;
    this.#http$.get<Booking[]>(bookingsUrl).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #updateActivityOnBookings() {
    if (!this.booked()) return;
    if (!this.activityStatusUpdated()) return;
    const activityUrl = `${this.#activitiesUrl}/${this.activity().id}`;
    this.#http$.put<Activity>(activityUrl, this.activity()).subscribe({
      next: () => console.log('Activity status updated'),
      error: (error) => console.error('Error updating activity', error),
    });
  }

  onNewBooking(newBooking: Booking) {
    this.#http$.post<Booking>(this.#bookingsUrl, newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error('Error creating booking', error),
    });
  }
}
