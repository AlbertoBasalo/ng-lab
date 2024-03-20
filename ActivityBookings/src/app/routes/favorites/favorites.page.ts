import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { FavoritesStore } from '@state/favorites.store';
import { Observable, forkJoin } from 'rxjs';

/**
 * Routed component for the Favorites page
 * Uses the RouterLink to navigate to the activity details
 * Uses the FavoritesStore to get the favorites
 * Uses the ActivitiesRepository to get the activities details
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    @for (activity of activities(); track activity) {
      <div>
        <span>
          <a [routerLink]="['/bookings', activity.slug]">{{ activity.name }}</a>
        </span>
        <span>at {{ activity.location }} on {{ activity.date }}</span>
      </div>
      <hr />
    } @empty {
      <div>No activities yet</div>
    }
  `,
})
export default class FavoritesPage {
  // * Injected services division

  /** Store for the favorites data*/
  #favoritesStore: FavoritesStore = inject(FavoritesStore);

  /** Repository to access activity data on the API*/
  #activitiesRepository: ActivitiesRepository = inject(ActivitiesRepository);

  // * Properties division

  /** A simple array with the of slugs of favorite activities*/
  #favoriteSlugs: string[] = this.#favoritesStore.state();

  /** A function that gets an observable of an activity based on its slug*/
  #getActivityBySlug$ = (favoriteSlug: string) => this.#activitiesRepository.getActivityBySlug$(favoriteSlug);

  /** Maps each element of the array of favorite slugs to an array of activity observable*/
  #mapActivitiesFromSlugs$: Observable<Activity>[] = this.#favoriteSlugs.map(this.#getActivityBySlug$);

  /** Forks in parallel, and joins the results in an only one observable of an array of favorite activities*/
  #activities$: Observable<Activity[]> = forkJoin(this.#mapActivitiesFromSlugs$);

  // * Signals division

  /** The signal (from the observable) list of activities that are favorites to use in the interface*/
  activities: Signal<Activity[]> = toSignal(this.#activities$, { initialValue: [] });
}
