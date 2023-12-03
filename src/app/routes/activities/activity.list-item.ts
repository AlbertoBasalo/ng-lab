import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../shared/domain/activity.type';

@Component({
  selector: 'lab-activity-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CurrencyPipe],
  template: `
    <li itemscope itemtype="http://schema.org/Product" [id]="activity.id">
      <span itemprop="name">
        <a href="/activities/{{ activity.slug }}">{{ activity.name }}</a>
      </span>
      <time itemprop="date" [attr.datetime]="activity.date">
        on {{ activity.date | date: 'EEEE dd-MMM' }}
      </time>
      <span itemprop="price" [attr.content]="activity.price">
        for only
        {{ activity.price | currency: 'EUR' : 'symbol' : '1.0-0' }}.
      </span>
    </li>
  `,
})
export class ActivityListItem {
  @Input({ required: true }) activity!: Activity;
}