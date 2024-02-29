import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesStore } from '@state/favorites.store';

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

  #favorites = inject(FavoritesStore);

  // * Properties division

  /** Application title */
  title = 'Activity Bookings';

  // * Computed properties division

  /** The number of favorites */
  favCount = this.#favorites.count;
}
