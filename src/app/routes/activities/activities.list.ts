import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ActivityListItemComponent } from '@routes/activities/activity-list-item.component';
import { Activity } from '@shared/domain/activity.type';

@Component({
  selector: 'lab-activities',
  standalone: true,
  imports: [ActivityListItemComponent],
  template: `
    @if (activities.length > 0) {
      <h4>
        <span id="activities-count">{{ activities.length }}</span>
        <span>activities found.</span>
      </h4>
      <ul id="activities-list">
        @for (activity of activities; track activity.id) {
          <lab-activity-list-item [activity]="activity" />
        }
      </ul>
    } @else {
      <h4>No activities found</h4>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesList {
  @Input({ required: true }) activities!: Activity[];
}
