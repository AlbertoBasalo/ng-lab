import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PageTemplate } from '@shared/ui/page.template';
import { ActivitySlugAdminComponent } from './activity-slug-admin.component';
import { ActivitySlugAdminPageStore } from './activity-slug-admin.page-store';

@Component({
  selector: 'lab-activity-slug-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ActivitySlugAdminPageStore],
  imports: [PageTemplate, ActivitySlugAdminComponent, JsonPipe],
  template: `
    <lab-page [store]="store">
      {{ activity() | json }}
      @for (booking of bookings(); track booking.id) {
        {{ booking | json }}
      }
    </lab-page>
  `,
})
export default class ActivitySlugAdminPage {
  // Injection division
  readonly store = inject(ActivitySlugAdminPageStore);

  activity = this.store.activity;
  bookings = this.store.bookings;
}
