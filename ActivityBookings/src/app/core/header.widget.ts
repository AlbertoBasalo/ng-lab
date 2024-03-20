import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '@state/favorites.store';
/**
 * Header widget with the main navigation
 * Reads the favorites count from the store
 * @todo Gets auth info from the store
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
          <li><a [routerLink]="['/auth', 'login']">Login</a></li>
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

  // * Properties division

  /** Application title */
  title: string = 'Activity Bookings';

  // * Computed properties division

  /** The number of favorites in a read only signal */
  favCount: Signal<number> = this.#favorites.count;
}
