import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '@shared/activity.type';
import { AuthStore } from '@shared/auth.store';
import { toState } from '@shared/state.function';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProfileComponent],
  template: `
    <article name="Profile">
      <header>
        <h2>{{ userName() }}</h2>
      </header>
      <lab-profile [activities]="activitiesState().value" />
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
  onLogout() {
    this.#authStore.clearUserToken();
    this.#router.navigate(['/']);
  }
}
