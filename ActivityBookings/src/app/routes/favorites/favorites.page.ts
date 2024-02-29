import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { FavoritesStore } from '@state/favorites.store';

@Component({
  selector: 'lab-favorites',
  standalone: true,
  imports: [],
  template: `
    @for (favorite of favorites(); track favorite) {
      <div>{{ favorite }}</div>
      <hr />
    } @empty {
      <div>No favorites yet</div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FavoritesPage {
  // * Injected services division

  // Store for the favorites data
  #favorites: FavoritesStore = inject(FavoritesStore);

  // * Properties division

  /** The signal list of favorites */
  favorites: Signal<string[]> = this.#favorites.state;

  // Todo: Load the favorites data from the API
}
