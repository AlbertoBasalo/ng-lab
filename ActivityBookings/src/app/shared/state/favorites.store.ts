import { Injectable, Signal, WritableSignal, computed, effect, inject, signal } from '@angular/core';
import { LocalRepository } from '@services/local.repository';

/**
 * Signal Store for the favorites data
 */
@Injectable({
  providedIn: 'root',
})
export class FavoritesStore {
  // * Injected services division

  /** To save and load the favorites from the local storage*/
  #localRepository: LocalRepository = inject(LocalRepository);

  // * Private properties division

  /** Signal to store the favorites as private state*/
  #state: WritableSignal<string[]> = signal<string[]>([]);

  // * Computed properties division

  /** The computed number of current favorites */
  count: Signal<number> = computed(() => this.#state().length);

  // * Public properties division

  /** The readonly signal with the current array of favorites */
  state: Signal<string[]> = this.#state.asReadonly();

  constructor() {
    this.#initializeFavorites();
    this.#saveFavoritesEffect();
  }

  // * Public methods division

  /**
   * Saves the new state of the favorites
   * @param favorites The array of favorites to be saved
   */
  setState(favorites: string[]): void {
    this.#state.set(favorites);
  }

  // * Private methods division

  /** Loads favorites from local storage if any, and initializes the state */
  #initializeFavorites(): void {
    const currentSavedFavorites = this.#localRepository.load('favorites', []);
    this.setState(currentSavedFavorites);
  }

  /** Register an effect for favorites changes to save them to local storage */
  #saveFavoritesEffect(): void {
    effect(() => this.#localRepository.save('favorites', this.#state()));
  }
}
