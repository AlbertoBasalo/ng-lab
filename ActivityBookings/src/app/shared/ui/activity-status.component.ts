import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, input } from '@angular/core';
import { ActivityStatus } from '@domain/activity.type';

/**
 * Component for presenting the status of an activity
 * Encapsulates the style and presentation internals of the status
 */
@Component({
  selector: 'lab-activity-status',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UpperCasePipe],
  template: `<span [class]="status()">{{ status() | uppercase }}</span>`,
  styles: `
    .draft {
      color: #017fc0;
      font-style: italic;
    }
    .published {
      color: #a5d601;
    }
    .confirmed {
      color: #00895a;
    }
    .sold-out {
      color: #398712;
      font-style: italic;
    }
    .done {
      color: #058686;
      font-style: italic;
    }
    .cancelled {
      color: #d93526;
      font-style: italic;
    }
  `,
})
export class ActivityStatusComponent {
  // * Input signals division

  /** The current status to be presented */
  status: InputSignal<ActivityStatus> = input.required<ActivityStatus>();
}
