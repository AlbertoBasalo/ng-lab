import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
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
  imports: [BookingCard, ActivityCard],
  template: `
    <article name="Profile">
      <header>
        <h2>{{ userName() }}</h2>
      </header>
      <h2>These are the activities you organize</h2>
      <div class="grid">
        @for (activity of activitiesState().value; track activity.id) {
          <lab-activity-card [activity]="activity" />
        }
      </div>
      <h2>These are the activities you booked</h2>
      <div class="grid">
        @for (booking of bookingsState().value; track booking.id) {
          <lab-booking-card [booking]="booking" />
        }
      </div>
      <footer>
        <button (click)="onLogout()">Logout</button>
      </footer>
    </article>
  `,
})
export default class ProfilePage {
  #service = inject(ProfileService);
  #authStore = inject(AuthStore);
  #router = inject(Router);
  userName = computed(() => `Hi, ${this.#authStore.user().username}`);
  activitiesState = toState<Activity[]>(
    this.#service.getActivities$(this.#authStore.getUserToken().user.id),
    [],
  );
  bookingsState = toState<Booking[]>(
    this.#service.getBookings$(this.#authStore.getUserToken().user.id),
    [],
  );
  onLogout() {
    this.#authStore.clearUserToken();
    this.#router.navigate(['/']);
  }
}
