import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { FavoritesStore } from '@state/favorites.store';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'lab-favorites',
  standalone: true,
  imports: [RouterLink],
  template: `
    @for (activity of activities(); track activity) {
      <div>
        <a [routerLink]="['/bookings', activity.slug]">{{ activity.name }}</a> at {{ activity.location }} on
        {{ activity.date }}
      </div>
      <hr />
    } @empty {
      <div>No activities yet</div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FavoritesPage {
  // * Injected services division

  // Store for the favorites data
  #favoritesStore: FavoritesStore = inject(FavoritesStore);

  // Repository to acces activity data on the API
  #activitiesRepository: ActivitiesRepository = inject(ActivitiesRepository);

  // * Properties division

  // Load the favorites data from the API

  /** The original signal list of favorites */
  // activities: Signal<string[]> = this.#favorites.state;

  /** A simple array with the of slugs of favorite activities*/
  #favoriteSlugs: string[] = this.#favoritesStore.state();

  /** A function that gets an observable of an activity based on its slug*/
  #getActivityBySlug$ = (favoriteSlug: string) => this.#activitiesRepository.getActivityBySlug$(favoriteSlug);

  /** Maps each element of the array of favorite slugs to an array of activity observable */
  #mapActivitiesFromSlugs$: Observable<Activity>[] = this.#favoriteSlugs.map(this.#getActivityBySlug$);

  /** Forks in parallel, and joins the results in an only one observable of an array of favorite activities*/
  #activities$: Observable<Activity[]> = forkJoin(this.#mapActivitiesFromSlugs$);

  /**
   * The signal list of activities that are favorites
   * @returns The signal to use in the interface
   */
  activities: Signal<Activity[]> = toSignal(this.#activities$, { initialValue: [] });
}
