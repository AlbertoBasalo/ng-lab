import { ChangeDetectionStrategy, Component, Input, OnInit, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { StatusComponent } from '@shared/ui/status.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugPageStore } from './activity-slug.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent, StatusComponent, RouterLink],
  providers: [ActivitySlugPageStore],
  template: `
    <lab-page [store]="store">
      @if (getActivityStatus() === 'success') {
        <lab-activity-slug [activity]="getActivity()" (booking)="onBooking()" />
      }
    </lab-page>
  `,
})
export default class ActivitySlugPage implements OnInit {
  // I/O division
  @Input({ required: true }) slug!: string;

  // Injection division
  readonly #router = inject(Router);
  readonly store = inject(ActivitySlugPageStore);

  // Data division
  getActivityStatus = this.store.getActivityStatus;
  getActivity = this.store.getActivity;

  // Life-cycle division
  constructor() {
    effect(() => this.#navigateAfterCreate());
    effect(() => this.#setPageTitle(), { allowSignalWrites: true });
  }

  ngOnInit() {
    this.store.getActivityBySlug(this.slug);
  }

  // Event handlers division
  onBooking() {
    const activity = this.getActivity();
    this.store.postBookActivity$(activity);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.store.postBookingStatus() === 'success') {
      this.#router.navigate(['/', 'bookings']);
    }
  }
  #setPageTitle() {
    if (this.getActivityStatus() === 'success') {
      this.store.setTitle(this.getActivity().name);
    } else {
      this.store.setTitle('Loading...');
    }
  }
}
