import { ChangeDetectionStrategy, Component, Input, OnInit, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugPageStore } from './activity-slug.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent],
  providers: [ActivitySlugPageStore],
  template: `
    <lab-page [store]="store">
      @if (getActivityStage() === 'success') {
        <lab-activity-slug [activity]="activity" (booking)="onBooking()" />
      }
    </lab-page>
  `,
})
export default class ActivitySlugPage implements OnInit {
  // Injection division
  readonly #router = inject(Router);
  readonly store = inject(ActivitySlugPageStore);

  // I/O division
  @Input({ required: true }) slug!: string;

  // Data division
  getActivityStage = this.store.getActivityStage;
  activity = this.store.activity;

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
    this.store.postBookActivity$(this.activity());
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.store.postBookingStage() === 'success') {
      this.#router.navigate(['/', 'bookings']);
    }
  }
  #setPageTitle() {
    if (this.getActivityStage() === 'success') {
      this.store.setTitle(this.activity().name);
    } else {
      this.store.setTitle(this.slug);
    }
  }
}
