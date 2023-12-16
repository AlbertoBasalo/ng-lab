import { ChangeDetectionStrategy, Component, Input, Signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@shared/domain/activity.type';

@Component({
  selector: 'lab-activity-slug-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer>
      @if (isOwner()) {
        <a role="button" [routerLink]="editLink()">Edit and manage your activity</a>
      } @else {
        @if (isBookable()) {
          <p>{{ availableText() }}</p>
          @if (availablePlaces() > 0) {
            <a role="button" [routerLink]="bookingLink()" [queryParams]="bookingParams()">Book now</a>
          }
        } @else {
          <p>This activity is not bookable.</p>
        }
      }
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlugFooterComponent {
  @Input({ required: true }) isOwner!: Signal<boolean>;
  @Input({ required: true }) activity!: Signal<Activity>;
  @Input({ required: true }) participants!: Signal<number>;
  @Input({ required: true }) availablePlaces!: Signal<number>;

  isBookable = computed(() => ['published', 'confirmed'].includes(this.activity().status));
  availableText = computed(() => {
    if (this.participants() === 0) {
      return 'Be the first to enroll.';
    }
    if (this.availablePlaces() === 0) {
      return 'Activity sold out. Wait for the next.';
    }
    return `There are ${this.availablePlaces()} available places.`;
  });

  editLink = computed(() => ['/', 'activities', this.activity().slug, 'admin']);
  bookingLink = computed(() => ['/', 'bookings', 'new']);
  bookingParams = computed(() => {
    const activity = this.activity();
    return {
      activityId: activity.id,
      activityName: activity.name,
      activityPrice: activity.price,
      availablePlaces: this.availablePlaces(),
    };
  });
}
