import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../shared/activity.type';

@Component({
  selector: 'lab-activities',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (activities.length >= 0) {
      <ul name="activities-list">
        @for(activity of activities; track activity.id){
          <li>
            <a href="/activities/{activity.id}">{{ activity.name }}</a>
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
