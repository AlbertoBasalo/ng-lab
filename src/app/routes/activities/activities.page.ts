import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { PageStore } from '@shared/services/page.store';
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
    <lab-page [store]="store">
      <lab-search (search)="onSearch($event)" />
      @if (getActivitiesStatus() === 'success') {
        <lab-activities [activities]="getActivitiesResult" />
      }
    </lab-page>
  `,
})
export default class ActivitiesPage {
  // injection division
  #service = inject(ActivitiesService);
  store = inject(PageStore);

  // Data division
  /** Observable of filter terms */
  #searchTerm$ = new BehaviorSubject<string>('');
  /** For any term received discard the current query and start a new one  */
  #activitiesByFilter$ = this.#searchTerm$.pipe(switchMap((filter) => this.#service.getActivitiesByFilter$(filter)));
  /** Signal with current state of an async command being issued */
  #getActivities = this.store.addSourceToStatusSignal<Activity[]>(this.#activitiesByFilter$, []);

  getActivitiesStatus = computed(() => this.#getActivities().status);
  getActivitiesResult = computed(() => this.#getActivities().result);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Find and book an activity');
  }

  // Event handlers division
  /** Notify the filter term to search for */
  onSearch(searchTerm: string): void {
    this.#searchTerm$.next(searchTerm);
  }
}
