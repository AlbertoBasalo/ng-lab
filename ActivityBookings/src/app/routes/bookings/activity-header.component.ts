import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Activity, ActivityStatus } from '@domain/activity.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';
import { ActivityTitlePipe } from '@ui/activity-title.pipe';

@Component({
  selector: 'lab-activity-header',
  standalone: true,
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
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityHeaderComponent {
  // input division
  activity = input.required<Activity>();
  activityStatus = input<ActivityStatus>();
}
