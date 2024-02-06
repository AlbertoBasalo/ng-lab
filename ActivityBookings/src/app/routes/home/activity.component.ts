import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '../../shared/domain/activity.type';

@Component({
  selector: 'lab-activity',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <div>
      <span>
        <a [routerLink]="['/bookings', activity().slug]">{{ activity().name }}</a>
      </span>
      <span>{{ activity().location }}</span>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  activity = input.required<Activity>();
}
