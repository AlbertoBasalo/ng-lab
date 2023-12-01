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
  imports: [SearchComponent, ActivitiesList, PendingComponent, ErrorComponent],
  providers: [ActivitiesService],
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
export default class ActivitiesPage {
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
