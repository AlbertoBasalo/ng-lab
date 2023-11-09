import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../shared/activity.type';

@Component({
  selector: 'lab-activities',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul>
      @for(activity of activities; track activity.id){
      <li>
        <a href="/activities/{activity.id}">{{ activity.name }}</a>
      </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesList {
  @Input({ required: true }) activities!: Activity[];
}
