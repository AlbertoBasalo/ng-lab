import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { FavoritesStore } from '@state/favorites.store';
import { forkJoin } from 'rxjs';

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
  #favorites: FavoritesStore = inject(FavoritesStore);

  #activitiesRepository: ActivitiesRepository = inject(ActivitiesRepository);

  // * Properties division

  // /** The signal list of favorites */
  // favorites: Signal<string[]> = this.#favorites.state;

  // Load the favorites data from the API

  /**
   * The list of activities that are favorites
   * @returns The list of activities that are favorites
   */
  activities: Signal<Activity[]> = toSignal(
    forkJoin(this.#favorites.state().map((favorite) => this.#activitiesRepository.getActivityBySlug$(favorite))),
    { initialValue: [] },
  );
}
