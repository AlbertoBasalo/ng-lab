import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../shared/activity.type';

@Component({
  selector: 'lab-activities',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (activities.length >= 0) {
      <h3>Listing <span id='activities-count'>{{ activities.length }}</span>activities</h3>
      <ul id="activities-list">
        @for(activity of activities; track activity.id){
          <li itemscope itemtype="http://schema.org/Product" [id]="activity.id">
            <span itemprop="name">
              <a href="/activities/{{activity.slug}}">{{ activity.name }}</a>
            </span>
            <time itemprop="date" [attr.datetime]="activity.date ">
              on {{ activity.date | date : 'EEEE dd-MMM' }}
            </time>
            <span itemprop="price" [attr.content]="activity.price">
              for only {{ activity.price | currency:'EUR' : 'symbol' : '1.0-0' }}.
            </span>
          </li>
        }
      </ul>
    } @else {
      <p>No activities found</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesList {
  @Input({ required: true }) activities!: Activity[];
}
