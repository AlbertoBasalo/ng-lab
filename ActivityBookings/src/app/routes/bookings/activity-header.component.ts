import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Activity, ActivityStatus } from '@domain/activity.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';
import { ActivityTitlePipe } from '@ui/activity-title.pipe';

/**
 * Component for presenting the header of an activity
 * Uses the ActivityTitlePipe, CurrencyPipe and DatePipe for the presentation
 * Delegate the presentation of the activity status to the ActivityStatusComponent
 * Receives the activity and the activityStatus as inputs
 */
@Component({
  selector: 'lab-activity-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityStatusComponent, CurrencyPipe, DatePipe, ActivityTitlePipe],
  template: `
    <h2>{{ activity() | activityTitle }}</h2>
    <div>
      <span>{{ activity().price | currency: 'EUR' }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      @if (activityStatus(); as status) {
        <lab-activity-status [status]="status" />
      }
    </div>
  `,
})
export class ActivityHeaderComponent {
  // * input division

  /** The activity to be presented */
  activity = input.required<Activity>();
  /** The status of the activity */
  activityStatus = input<ActivityStatus>();
}
