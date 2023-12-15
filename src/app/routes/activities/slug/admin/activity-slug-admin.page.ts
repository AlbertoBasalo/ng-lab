import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { ActivitySlugPageStore } from '../activity-slug.page-store';
import { ActivitySlugAdminComponent } from './activity-slug-admin.component';

@Component({
  selector: 'lab-activity-slug-admin',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugAdminComponent, JsonPipe, RouterLink],
  template: `
    <lab-page [store]="store">
      {{ activity() | json }}
      <a [routerLink]="['/', 'activities', activity().slug]">View</a>
      <ul>
        @for (booking of bookings(); track booking.id) {
          <li>{{ booking | json }}</li>
        }
      </ul>
    </lab-page>
  `,
})
export default class ActivitySlugAdminPage implements OnInit {
  // Injection division
  readonly store = inject(ActivitySlugPageStore);

  // I/O division
  @Input({ required: true }) slug!: string;

  activity = this.store.activity;
  bookings = this.store.bookings;

  ngOnInit() {
    this.store.getActivityBySlug(this.slug);
  }
}
