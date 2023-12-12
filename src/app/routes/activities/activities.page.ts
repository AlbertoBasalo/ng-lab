import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { toSignal } from '@shared/services/command.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { PendingComponent } from '@shared/ui/pending.component';
import { SearchComponent } from '@shared/ui/search.component';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, SearchComponent, ActivitiesList, PendingComponent, ErrorComponent],
  providers: [ActivitiesService],
  template: `
    <lab-page title="Published activities">
      <main>
        <lab-search (search)="onSearch($event)" />
        @if (getActivitiesStatus() === 'success') {
          <article name="activities">
            <header>
              <h3>Select an activity to book... and enjoy!</h3>
            </header>
            <lab-activities [activities]="getActivitiesResult()" />
          </article>
        }
      </main>
      <footer>
        @switch (getActivitiesStatus()) {
          @case ('pending') {
            <lab-pending message="Loading activities" />
          }
          @case ('error') {
            <lab-error [message]="getActivitiesError()" />
          }
        }
      </footer>
    </lab-page>
  `,
})
export default class ActivitiesPage {
  // injection division

  #service = inject(ActivitiesService);

  // component data division

  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(switchMap((filter) => this.#service.getActivitiesByFilter$(filter)));
  /** Signal with current state of an async command being issued */
  #getActivities = toSignal<Activity[]>(this.#activitiesByFilter$, []);

  // template data division

  getActivitiesResult = computed(() => this.#getActivities().result);
  getActivitiesStatus = computed(() => this.#getActivities().status);
  getActivitiesError = computed(() => `Failed to load ${this.#getActivities().error}`);

  // template event handlers division

  /** Notify the filter term to search for */
  onSearch(searchTerm: string): void {
    this.#searchTerm$.next(searchTerm);
  }
}
