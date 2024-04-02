import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Activity } from '@domain/activity.type';
import { ActivityForm } from './activity.form';
import { ActivityService } from './activity.service';
/**
 * Routed component for the Activity page
 * Presents the ActivityForm to create a new activity
 * Uses the ActivityService to post the activity
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityForm],
  template: ` <lab-activity (save)="onSave($event)" /> `,
})
export default class ActivityPage {
  // * Injected services division

  /** The service to post the activity */
  #activityService = inject(ActivityService);

  // * Event handlers division

  /**
   * Handles the save event from the ActivityForm
   * @param {Activity} activity The activity to save
   */
  onSave(activity: Activity) {
    // ToDo: Give feedback to the user
    this.#activityService.postActivity$(activity).subscribe();
  }
}
