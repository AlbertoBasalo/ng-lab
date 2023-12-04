import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  providers: [ProfileService],
  imports: [BookingCard, ActivityCard, RouterLink],
  template: `
    <article name="Profile">
      <header>
        <h2>{{ userName }}</h2>
      </header>
      @switch (role) {
        @case ('organizer') {
          <h2>These are your organized activities</h2>
          <div class="grid">
            @for (activity of activitiesState().value; track activity.id) {
              <lab-activity-card [activity]="activity" />
            } @empty {
              <p>You don't have any activities yet.</p>
              <a routerLink="/activities/new">Create one</a>
            }
          </div>
        }
        @case ('participant') {
          <h2>These are your booked activities</h2>
          <div class="grid">
            @for (booking of bookingsState().value; track booking.id) {
              <lab-booking-card [booking]="booking" />
            } @empty {
              <p>You don't have any bookings yet.</p>
              <a routerLink="/activities">Book one</a>
            }
          </div>
        }
      }
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
  // data division
  readonly #user = this.#authStore.user();
  readonly #activities$ = this.#service.getActivities$(this.#user.id);
  readonly #bookings$ = this.#service.getBookings$(this.#user.id);
  // template data division
  readonly userName = `Hi, ${this.#user.username}`;
  readonly role = this.#user.role;
  readonly activitiesState = toState<Activity[]>(this.#activities$, []);
  readonly bookingsState = toState<Booking[]>(this.#bookings$, []);
  // template events division
  onLogout() {
    this.#authStore.logout();
  }
}
