import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { ActivitySlugStore } from '../activity-slug.store';
import { ActivitySlugAdminComponent } from './activity-slug-admin.component';

@Component({
  selector: 'lab-activity-slug-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugAdminComponent, JsonPipe, RouterLink],
  providers: [ActivitySlugStore],
  template: `
    <lab-page [title]="title()">
      @if (activity()) {
        {{ activity() | json }}
        <div><a [routerLink]="['/', 'activities', activity().slug]">View</a></div>
      }
      @if (bookings()) {
        <ul>
          @for (booking of bookings(); track booking.id) {
            <li>{{ booking | json }}</li>
          }
        </ul>
      }
    </lab-page>
  `,
})
export default class ActivitySlugAdminPage {
  // Injection division
  readonly #store = inject(ActivitySlugStore);

  // I/O division
  @Input({ required: true }) set slug(value: string) {
    this.#store.slug.set(value);
  }

  // Data division
  getActivityStage = this.#store.getActivityStage;
  getBookingsStage = this.#store.getBookingsStage;
  activity = this.#store.activity;
  bookings = this.#store.bookings;
  title = computed(() => this.activity().name || this.#store.slug());
}
