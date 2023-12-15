import { ChangeDetectionStrategy, Component, Input, OnInit, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { ActivitySlugFooterComponent } from './activity-slug-footer.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugPageStore } from './activity-slug.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent, ActivitySlugFooterComponent],
  template: `
    <lab-page [store]="store">
      @if (getActivityStage() === 'success') {
        <lab-activity-slug
          [activity]="activity"
          [participants]="store.participants"
          [availablePlaces]="store.availablePlaces"
        />
      }
      <lab-activity-slug-footer
        [isOwner]="store.isOwner"
        [availableText]="store.availableText"
        [isBookable]="store.isBookable"
        [availablePlaces]="store.availablePlaces"
        (booking)="onBookingClick()"
        (edit)="onEditClick()"
      />
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
    effect(() => this.#setPageTitle(), { allowSignalWrites: true });
    effect(() => this.#getParticipants(), { allowSignalWrites: true });
  }

  ngOnInit() {
    this.store.getActivityBySlug(this.slug);
  }

  // Event handlers division
  onBookingClick() {
    this.#router.navigate(['/', 'bookings', 'new'], {
      queryParams: {
        activityId: this.activity().id,
        activityName: this.activity().name,
        activityPrice: this.activity().price,
        availablePlaces: this.store.availablePlaces(),
      },
    });
  }
  onEditClick() {
    this.#router.navigate(['/', 'activities', this.activity().slug, 'admin']);
  }

  // Effects division
  #setPageTitle() {
    if (this.getActivityStage() === 'success') {
      this.store.setTitle(this.activity().name);
    } else {
      this.store.setTitle(this.slug);
    }
  }
  #getParticipants() {
    if (this.getActivityStage() === 'success') {
      this.store.getParticipantsByActivityId(this.activity().id);
    }
  }
}
