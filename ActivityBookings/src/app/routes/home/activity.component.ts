import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@domain/activity.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';

@Component({
  selector: 'lab-activity',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, ActivityStatusComponent],
  template: `
    <div>
      <span>
        <a [routerLink]="['/bookings', activity().slug]">{{ activity().name }}</a>
      </span>
      <span>{{ activity().location }}</span>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      <lab-activity-status [status]="activity().status" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  // * Input signals division

  /** The current Activity to be presented*/
  activity: InputSignal<Activity> = input.required<Activity>();
}
