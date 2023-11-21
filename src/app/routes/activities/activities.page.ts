import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Activity } from '@shared/activity.type';
import { ErrorComponent } from '@shared/error.component';
import { PendingComponent } from '@shared/pending.component';
import { SearchComponent } from '@shared/search.component';
import { toState } from '@shared/state.function';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  imports: [SearchComponent, ActivitiesList, PendingComponent, ErrorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lab-search (search)="onSearch($event)" />
    @switch (state().status) {
      @case ('pending') {
        <lab-pending message="Loading activities" />
      }
      @case ('error') {
        <lab-error [message]="errorMessage()" />
      }
      @default {
        <article name="Published activities">
          <header>
            <h2>Select an activity to book... and enjoy!</h2>
          </header>
          <lab-activities [activities]="state().value" />
        </article>
      }
    }
  `,
})
export default class HomePage {
  #service = inject(ActivitiesService);
  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(
    switchMap((filter) => this.#service.getActivitiesByFilter$(filter)),
  );

  /** Signal with current state of an async command being issued */
  state = toState<Activity[]>(this.#activitiesByFilter$, []);

  /** Notify the filter term to search for */
  onSearch(searchTerm: string): void {
    this.#searchTerm$.next(searchTerm);
  }

  errorMessage = computed(() => `Failed to load ${this.state().error}`);
}
