import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivityCard } from '@routes/bookings/activity.card';
import { BookingCard } from '@routes/bookings/booking.card';
import { AuthStore } from '@shared/services/auth.store';
import { PageTemplate } from '@shared/ui/page.template';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, BookingCard, ActivityCard, RouterLink],
  template: `
    <lab-page [title]="userName">
      <main>
        <p>You can <a routerLink="/activities/new">organize</a> your own activities, .</p>
        <p><a routerLink="/activities">Book an activity</a> to participate.</p>
        <p>If you have already book one <a routerLink="/bookings">check your bookings.</a></p>
      </main>
      <footer>
        <button (click)="onLogout()">Logout</button>
      </footer>
    </lab-page>
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
