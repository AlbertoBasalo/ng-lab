import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@domain/user.type';
import { environment } from '@env/environment';
import { AuthStore } from '@services/state/auth.store';
import { FavoritesStore } from '@services/state/favorites.store';

/**
 * Header widget with the main navigation
 * - Reads the favorites count from the store
 * - Shows the link to the new activity page if the user is authenticated
 * - Shows the link to the login page if the user is anonymous
 */
@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <ul>
          <a [routerLink]="['/']" class="title">{{ title }}</a>
        </ul>
        <ul>
          <li>
            <a [routerLink]="['/', 'favorites']">
              <span>
                My favorites
                <sup>
                  <mark>{{ favCount() }}</mark>
                </sup>
              </span>
            </a>
          </li>
          @if (isAuthenticated()) {
            <li><a [routerLink]="['/', 'activity', 'new']">New Activity</a></li>
            <li id="user">{{ user().email }}</li>
          }
          @if (isAnonymous()) {
            <li><a [routerLink]="['/auth', 'login']">Login</a></li>
          }
        </ul>
      </nav>
    </header>
  `,
  styles: `
    .title {
      font-size: 1.2rem;
      font-weight: bold;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderWidget {
  // * Injected services division

  /**  Store for the favorites data*/
  #favorites: FavoritesStore = inject(FavoritesStore);

  /** The Auth Store to know if user is authenticated */
  #authStore: AuthStore = inject(AuthStore);

  // * Properties division

  /** Application title */
  title: string = environment.appName;

  // * Computed properties division

  /** The number of favorites in a read only signal */
  favCount: Signal<number> = this.#favorites.count;

  /** The user is authenticated */
  isAuthenticated: Signal<boolean> = this.#authStore.isAuthenticated;
  /** The user is anonymous */
  isAnonymous: Signal<boolean> = this.#authStore.isAnonymous;

  user: Signal<User> = this.#authStore.user;
}
