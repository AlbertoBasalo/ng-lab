import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Activity } from '@domain/activity.type';
import { ActivityForm } from './activity.form';
import { ActivityService } from './activity.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityForm],
  template: ` <lab-activity (save)="onSave($event)" /> `,
})
export default class ActivityPage {
  #activityService = inject(ActivityService);

  onSave(activity: Activity) {
    this.#activityService.postActivity$(activity).subscribe();
  }
}
