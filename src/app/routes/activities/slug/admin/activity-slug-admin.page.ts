import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, effect, inject } from '@angular/core';
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
      <div><a [routerLink]="['/', 'activities', activity().slug]">View</a></div>
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

  // Life-cycle division
  constructor() {
    //effect(() => this.#setPageTitle(), { allowSignalWrites: true });
    effect(() => this.#getParticipants(), { allowSignalWrites: true });
  }

  ngOnInit() {
    this.store.getActivityBySlug(this.slug);
  }

  #getParticipants() {
    if (this.store.getActivityStage() === 'success') {
      this.store.getParticipantsByActivityId(this.activity().id);
    }
  }
}
