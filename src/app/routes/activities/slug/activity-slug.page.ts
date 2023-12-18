import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { WorkingComponent } from '@shared/ui/working.component';
import { ActivitySlugFooterComponent } from './activity-slug-footer.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugStore } from './activity-slug.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent, ActivitySlugFooterComponent, WorkingComponent, ErrorComponent],
  providers: [ActivitySlugStore],
  template: `
    <lab-page [title]="title()">
      @if (loaded()) {
        <lab-activity-slug
          [activity]="activity()"
          [participants]="participants()"
          [availablePlaces]="availablePlaces()"
        />
        <lab-activity-slug-footer
          [isOwner]="isOwner"
          [activity]="activity"
          [participants]="participants"
          [availablePlaces]="availablePlaces"
        />
      } @else if (gotError()) {
        <lab-error [error]="error" />
      } @else {
        <lab-working />
      }
    </lab-page>
  `,
})
export default class ActivitySlugPage {
  // Injection division
  readonly #store = inject(ActivitySlugStore);

  // I/O division
  @Input({ required: true }) set slug(value: string) {
    this.#store.setSlug(value);
  }

  // Data division
  error = 'Sorry, something went wrong, please, try again.';
  getActivityStage = this.#store.getActivityStage;
  getBookingsStage = this.#store.getBookingsStage;
  activity = this.#store.activity;
  title = this.#store.title;
  participants = this.#store.participants;
  isOwner = this.#store.isOwner;
  availablePlaces = this.#store.availablePlaces;
  loaded = computed(() => this.getActivityStage() === 'success' && this.getBookingsStage() === 'success');
  gotError = computed(() => this.getActivityStage() === 'error' || this.getBookingsStage() === 'error');
}
