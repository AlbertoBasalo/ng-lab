import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@shared/domain/activity.type';

@Component({
  selector: 'lab-activity-list-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, CurrencyPipe, RouterLink],
  template: `
    <li itemscope itemtype="http://schema.org/Product" [id]="activity.id">
      <span itemprop="name">
        <a [routerLink]="['kk' + activity.slug]">{{ activity.name }}</a>
      </span>
      <span itemprop="location" [attr.content]="activity.location"> at {{ activity.location }} </span>
      <span>
        <time itemprop="date" [attr.datetime]="activity.date">
          on <i>{{ activity.date | date: 'EEEE dd-MMM' }}</i>
        </time>
      </span>
      <span itemprop="price" [attr.content]="activity.price">
        for only <b>{{ activity.price | currency: 'EUR' : 'symbol' : '1.0-0' }}</b
        >.
      </span>
    </li>
  `,
})
export class ActivityListItemComponent {
  @Input({ required: true }) activity!: Activity;
}
