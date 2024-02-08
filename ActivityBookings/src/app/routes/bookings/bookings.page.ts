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
import { toSignalMap } from '@api/signal.functions';
import { getNextActivityStatus } from '@domain/activity.functions';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
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
            [totalParticipants]="totalParticipants()"
          />
        </main>
        <footer>
          @if (isBookable()) {
            <lab-booking-form
              [activity]="activity"
              [alreadyParticipants]="alreadyParticipants()"
              [remainingPlaces]="remainingPlaces()"
              [bookingSaved]="bookingSaved()"
              (changeParticipants)="onChangeParticipants($event)"
              (saveBooking)="onSaveBooking($event)"
            />
          }
        </footer>
      </article>
    }
  `,
})
export default class BookingsPage {
  // inject division
  #service = inject(BookingsService);

  // input division
  slug = input<string>();

  // signal division
  bookingSaved: WritableSignal<boolean> = signal(false);
  newParticipants: WritableSignal<number> = signal(0);

  // computed division

  // async signal division
  activity: Signal<Activity> = toSignalMap(
    this.slug,
    (slug) => this.#service.getActivityBySlug$(slug),
    NULL_ACTIVITY,
  );
  activityBookings: Signal<Booking[]> = toSignalMap(
    this.activity,
    (activity) => this.#service.getBookingsByActivityId$(activity.id),
    [],
  );

  activityStatus: Signal<ActivityStatus> = computed(() =>
    getNextActivityStatus(this.activity(), this.totalParticipants()),
  );
  alreadyParticipants: Signal<number> = computed(() =>
    this.activityBookings().reduce((acc, booking) => acc + booking.participants, 0),
  );
  isBookable: Signal<boolean> = computed(() =>
    ['published', 'confirmed'].includes(this.activity().status),
  );
  totalParticipants: Signal<number> = computed(
    () => this.alreadyParticipants() + this.newParticipants(),
  );
  remainingPlaces: Signal<number> = computed(
    () => this.activity().maxParticipants - this.totalParticipants(),
  );

  // event division
  onChangeParticipants(newParticipants: number) {
    this.newParticipants.set(newParticipants);
  }

  onSaveBooking(newBooking: Booking) {
    this.#service.postBooking$(newBooking).subscribe({
      next: () => {
        this.bookingSaved.set(true);
        if (!this.activityStatus()) return;
        this.#service.updateActivityStatus$(this.activity(), this.activityStatus()).subscribe();
      },
      error: (error) => console.error('Error creating booking', error),
    });
  }
}
