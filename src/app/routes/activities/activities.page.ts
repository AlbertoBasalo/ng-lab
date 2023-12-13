import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageTemplate } from '@shared/ui/page.template';
import { SearchComponent } from '@shared/ui/search.component';
import { ActivitiesList } from './activities.list';
import { ActivitiesPageStore } from './activities.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, SearchComponent, ActivitiesList],
  providers: [ActivitiesPageStore],
  template: `
    <lab-page [store]="store">
      <lab-search (search)="onSearch($event)" />
      @if (getActivitiesStatus() === 'success') {
        <lab-activities [activities]="activities" />
      }
    </lab-page>
  `,
})
export default class ActivitiesPage {
  // injection division
  readonly store = inject(ActivitiesPageStore);

  // Data division
  getActivitiesStatus = this.store.getActivitiesStatus;
  activities = this.store.activities;

  // Event handlers division
  onSearch(searchTerm: string): void {
    this.store.getActivitiesBySearchTerm(searchTerm);
  }
}
