import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { toSignal } from '@shared/services/command.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { SearchComponent } from '@shared/ui/search.component';
import { WorkingComponent } from '@shared/ui/working.component';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, SearchComponent, ActivitiesList, WorkingComponent, ErrorComponent],
  providers: [ActivitiesService],
  template: `
    <lab-page title="Find and book an activity" [commandStatus]="getActivities()">
      <lab-search (search)="onSearch($event)" />
      @if (getActivities().status === 'success') {
        <lab-activities [activities]="getActivitiesResult" />
      }
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

  getActivities = computed(() => this.#getActivities());
  getActivitiesResult = computed(() => this.#getActivities().result);

  // template event handlers division

  /** Notify the filter term to search for */
  onSearch(searchTerm: string): void {
    this.#searchTerm$.next(searchTerm);
  }
}
