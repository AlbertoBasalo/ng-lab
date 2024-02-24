import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Activity } from '@domain/activity.type';
import { ActivityComponent } from './activity.component';
import { HomeService } from './home.service';

@Component({
  standalone: true,
  imports: [ActivityComponent, JsonPipe],
  template: `
    <article>
      <header>
        <h2>Activities</h2>
      </header>
      <main>
        @for (activity of activities(); track activity.id) {
          <lab-activity [activity]="activity" [(favorites)]="favorites" (favoritesChange)="onFavoritesChange($event)" />
        }
      </main>
    </article>
    {{ favorites | json }}
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  // * Injected services division

  #service = inject(HomeService);

  // * Signals division

  /** The list of activities to be presented */
  activities: Signal<Activity[]> = toSignal(this.#service.getActivities$(), { initialValue: [] });

  /** The list of favorites */
  favorites: string[] = [];

  // * Methods division

  /** Handles the change of the favorites list */
  onFavoritesChange(favorites: string[]): void {
    console.log('Favorites changed', favorites);
  }
}
