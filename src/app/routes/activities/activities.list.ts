import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { ActivityListItemComponent } from '@routes/activities/activity-list-item.component';
import { Activity } from '@shared/domain/activity.type';
import { ListTemplate } from '@shared/ui/list.template';

@Component({
  selector: 'lab-activities',
  standalone: true,
  imports: [ActivityListItemComponent, ListTemplate],
  template: `
    <lab-list name="Activities" [items]="activities" [itemTemplate]="activityTemplate" />
    <ng-template #activityTemplate let-activity>
      <lab-activity-list-item [activity]="activity" />
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesList {
  @Input({ required: true }) activities!: Signal<Activity[]>;
}
