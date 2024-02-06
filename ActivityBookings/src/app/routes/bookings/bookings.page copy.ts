import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { toSignalMap } from '../../shared/api/signal.functions';
import { Activity, NULL_ACTIVITY } from '../../shared/domain/activity.type';
import { Booking } from '../../shared/domain/booking.type';
import { BookingsComponent } from './bookings.component';
import { BookingsService } from './bookings.service';

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
class WipBookingsPage {
  // injection division
  #service = inject(BookingsService);

  // input division
  slug = input<string>();

  // signal division
  alreadyParticipants = signal(0);
  booked = signal(false);
  activityStatusUpdated = signal(false);

  // interop division
  activity: Signal<Activity> = toSignalMap(
    this.slug,
    (slug) => this.#service.getActivityBySlug$(slug),
    NULL_ACTIVITY,
  );

  constructor() {
    const ALLOW_WRITE = { allowSignalWrites: true };
    effect(() => this.#getParticipantsOnActivity(), ALLOW_WRITE);
    effect(() => this.#updateActivityOnBookings(), ALLOW_WRITE);
  }

  // event division
  onNewParticipantsChange(totalParticipants: number) {
    const oldStatus = this.activity().status as string;
    let newStatus = this.activity().status;
    if (totalParticipants >= this.activity().maxParticipants) {
      newStatus = 'sold-out';
    } else if (totalParticipants >= this.activity().minParticipants) {
      newStatus = 'confirmed';
    } else {
      newStatus = 'published';
    }
    if (newStatus === oldStatus) return;
    this.activity().status = newStatus;
    this.activityStatusUpdated.set(true);
  }

  onNewBooking(newBooking: Booking) {
    this.#service.postBooking$(newBooking).subscribe({
      next: () => this.booked.set(true),
      error: (error) => console.error('Error creating booking', error),
    });
  }

  // effect division
  #getParticipantsOnActivity() {
    const id = this.activity().id;
    if (id === 0) return;
    this.#service.getBookingsByActivityId$(id).subscribe((bookings) => {
      bookings.forEach((booking) => {
        this.alreadyParticipants.update((participants) => participants + booking.participants);
      });
    });
  }

  #updateActivityOnBookings() {
    if (!this.booked()) return;
    if (!this.activityStatusUpdated()) return;
    this.#service.putActivity$(this.activity()).subscribe({
      next: () => console.log('Activity status updated'),
      error: (error) => console.error('Error updating activity', error),
    });
  }
}
