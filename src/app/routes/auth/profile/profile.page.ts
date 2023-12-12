import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';
import { PageTemplate } from '@shared/ui/page.template';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, RouterLink],
  template: `
    <lab-page [title]="userName">
      <nav>
        <p>You can <a routerLink="/activities/new">organize</a> your own activities, .</p>
        <p><a routerLink="/activities">Book an activity</a> to participate.</p>
        <p>If you have already book one <a routerLink="/bookings">check your bookings.</a></p>
      </nav>
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
