import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Activity } from '../../shared/activity.type';
import { SearchComponent } from '../../shared/search.component';
import { toState } from '../../shared/state.function';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  imports: [SearchComponent, ActivitiesList],
  template: `
    <lab-search (search)="onSearch($event)" />
    @switch (state().status) {
      @case ('pending') {
        <aside id="loading">
          <p aria-busy="true">Loading activities...</p>
        </aside>
      }
      @case ('error') {
        <aside id="error">
          <small>Failed to load activities : {{ state().error }}</small>
        </aside>
      }
      @default {
        <article name="Published activities">
          <header>
            <h2>Book an activity and enjoy!</h2>
          </header>
          <lab-activities [activities]="state().value" />
        </article>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #service = inject(ActivitiesService);
  /** Observable of filter terms */
  #filterTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#filterTerm$.pipe(
    switchMap((filter) => this.#service.getActivitiesByFilter$(filter)),
  );
  /** Signal with current state of an async command being issued */
  state = toState<Activity[]>(this.#activitiesByFilter$, []);
  /** Notify the filter term to search for */
  onSearch(value: string): void {
    console.log('onSearch', value);
    this.#filterTerm$.next(value);
  }
}
