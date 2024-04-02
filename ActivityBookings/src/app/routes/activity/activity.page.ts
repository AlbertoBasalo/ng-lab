import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { Activity } from '@domain/activity.type';
import { Feedback, FeedbackComponent } from '@ui/feedback.component';
import { ActivityForm } from './activity.form';
import { ActivityService } from './activity.service';
/**
 * Routed component for the Activity page
 * Presents the ActivityForm to create a new activity
 * Presents the FeedbackComponent to give feedback to the user
 * Uses the ActivityService to post the activity
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivityForm, FeedbackComponent],
  template: `
    <lab-activity (save)="onSave($event)" />
    <lab-feedback [feedback]="feedback()" />
  `,
})
export default class ActivityPage {
  // * Injected services division

  /** The service to post the activity */
  #activityService = inject(ActivityService);

  feedback: WritableSignal<Feedback> = signal<Feedback>({ status: 'idle', message: '' });

  // * Event handlers division

  /**
   * Handles the save event from the ActivityForm
   * @param {Activity} activity The activity to save
   */
  onSave(activity: Activity) {
    this.feedback.set({ status: 'busy', message: 'Saving activity' });
    this.#activityService.postActivity$(activity).subscribe({
      next: () => this.feedback.set({ status: 'success', message: 'Activity saved' }),
      error: () => this.feedback.set({ status: 'error', message: 'Failed to save activity' }),
    });
  }
}
