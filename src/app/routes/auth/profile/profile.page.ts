import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityCard } from '@routes/bookings/activity.card';
import { BookingCard } from '@routes/bookings/booking.card';
import { AuthStore } from '@shared/services/auth.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BookingCard, ActivityCard, RouterLink],
  template: `
    <article name="Profile">
      <header>
        <h2>{{ userName }}</h2>
      </header>
      <p>You can organize your own activities.</p>
      <a routerLink="/activities/new">Create one</a>
      <p>Or participate in any published activity.</p>
      <a routerLink="/activities">Book one</a>
      <p>If you have already book one.</p>
      <a routerLink="/bookings">Check your bookings</a>
      <footer>
        <button (click)="onLogout()">Logout</button>
      </footer>
    </article>
  `,
})
export default class ProfilePage {
  // injection division
  readonly #authStore = inject(AuthStore);

  // component data division
  readonly #user = this.#authStore.user();

  // template data division
  readonly userName = `Hi, ${this.#user.username}`;

  // template events division
  onLogout() {
    this.#authStore.logout();
  }
}
