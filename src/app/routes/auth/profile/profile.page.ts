import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityCard } from '@routes/auth/profile/activity.card';
import { BookingCard } from '@routes/auth/profile/booking.card';
import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { toState } from '@shared/services/state.signal';
import { ProfileService } from './profile.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingCard, ActivityCard, RouterLink],
  providers: [ProfileService],
  template: `
    <article name="Profile">
      <header>
        <h2>{{ userName }}</h2>
      </header>
      <h2>These are your organized activities</h2>
      <div class="grid">
        @for (activity of activities(); track activity.id) {
          <lab-activity-card [activity]="activity" />
        } @empty {
          <p>You don't have any activities yet.</p>
          <a routerLink="/activities/new">Create one</a>
        }
      </div>
      <h2>These are your booked activities</h2>
      <div class="grid">
        @for (booking of bookings(); track booking.id) {
          <lab-booking-card [booking]="booking" />
        } @empty {
          <p>You don't have any bookings yet.</p>
          <a routerLink="/activities">Book one</a>
        }
      </div>
      <footer>
        <button (click)="onLogout()">Logout</button>
      </footer>
    </article>
  `,
})
export default class ProfilePage {
  // injection division

  readonly #authStore = inject(AuthStore);
  readonly #service = inject(ProfileService);

  // component data division

  readonly #user = this.#authStore.user();
  readonly #getActivities$ = this.#service.getActivities$(this.#user.id);
  readonly #getBookings$ = this.#service.getBookings$(this.#user.id);
  readonly #getActivitiesState = toState<Activity[]>(this.#getActivities$, []);
  readonly #getBookingsState = toState<Booking[]>(this.#getBookings$, []);

  // template data division

  readonly userName = `Hi, ${this.#user.username}`;
  readonly activities = computed(() => this.#getActivitiesState().value);
  readonly bookings = computed(() => this.#getBookingsState().value);

  // template events division

  onLogout() {
    this.#authStore.logout();
  }
}
