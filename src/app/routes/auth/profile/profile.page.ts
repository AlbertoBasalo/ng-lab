import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';
import { PageStore } from '@shared/services/page.store';
import { PageTemplate } from '@shared/ui/page.template';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, RouterLink],
  template: `
    <lab-page [store]="store">
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
  // Injection division
  readonly #authStore = inject(AuthStore);
  readonly store = inject(PageStore);

  // Life-cycle division
  constructor() {
    effect(() => this.#setPageTitle(), { allowSignalWrites: true });
  }

  // Event handlers division
  onLogout() {
    this.#authStore.logout();
  }

  // Effect handlers division
  #setPageTitle() {
    this.store.setTitle(`Hi, ${this.#authStore.user().username}`);
  }
}
