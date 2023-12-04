import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { toState } from '@shared/services/state.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PendingComponent } from '@shared/ui/pending.component';
import { SearchComponent } from '@shared/ui/search.component';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchComponent, ActivitiesList, PendingComponent, ErrorComponent],
  providers: [ActivitiesService],
  template: `
    <lab-search (search)="onSearch($event)" />
    @switch (getActivitiesStatus()) {
      @case ('pending') {
        <lab-pending message="Loading activities" />
      }
      @case ('error') {
        <lab-error [message]="getActivitiesError()" />
      }
      @default {
        <article name="activities">
          <header>
            <h2>Select an activity to book... and enjoy!</h2>
          </header>
          <lab-activities [activities]="getActivities()" />
        </article>
      }
    }
  `,
})
export default class ActivitiesPage {
  // injection division

  #service = inject(ActivitiesService);

  // component data division

  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(
    switchMap((filter) => this.#service.getActivitiesByFilter$(filter)),
  );
  /** Signal with current state of an async command being issued */
  #getActivitiesState = toState<Activity[]>(this.#activitiesByFilter$, []);

  // template data division

  getActivities = computed(() => this.#getActivitiesState().value);
  getActivitiesStatus = computed(() => this.#getActivitiesState().status);
  getActivitiesError = computed(
    () => `Failed to load ${this.#getActivitiesState().error}`,
  );

  // template event handlers division

  /** Notify the filter term to search for */
  onSearch(searchTerm: string): void {
    this.#searchTerm$.next(searchTerm);
  }
}
