import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../../shared/domain/activity.type';

@Component({
  selector: 'lab-activity-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  template: `
    <article [id]="activity.id" class="activity">
      <header>
        <h3>{{ activity.name }}</h3>
      </header>
      <p>{{ activity.date | date: 'yyyy/MM/dd' }}</p>
      <p>{{ activity.location }}</p>
    </article>
  `,
})
export class ActivityCard {
  @Input({ required: true }) activity!: Activity;
}
