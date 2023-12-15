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
        <lab-activity-slug [activity]="activity" [participants]="participants" [availablePlaces]="availablePlaces" />
      }
      <footer>
        @if (isOwner()) {
          <button id="editActivity" (click)="onEditClick()">Edit and manage your activity</button>
        } @else {
          @if (isBookable()) {
            <p>{{ availableText() }}</p>
            @if (availablePlaces() > 0) {
              <button id="bookingActivity" (click)="onBookingClick()">Book now</button>
            }
          }
        }
      </footer>
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
  isOwner = this.store.isOwner;
  getActivityStage = this.store.getActivityStage;
  activity = this.store.activity;
  participants = this.store.participants;
  availablePlaces = this.store.availablePlaces;
  availableText = this.store.availableText;
  isBookable = this.store.isBookable;

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
        availablePlaces: this.availablePlaces(),
      },
    });
  }
  onEditClick() {
    this.#router.navigate(['/', 'activities', this.activity().slug, 'edit']);
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
