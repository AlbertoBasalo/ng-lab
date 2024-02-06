import { UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ActivityStatus } from '@domain/activity.type';

@Component({
  selector: 'lab-activity-status',
  standalone: true,
  imports: [UpperCasePipe],
  template: ` <span [class]="status()">{{ status() | uppercase }}</span> `,
  styles: `
    .draft {
      color: aqua;
      font-style: italic;
    }
    .published {
      color: navy;
    }
    .confirmed {
      color: green;
    }
    .sold-out {
      color: teal;
      font-style: italic;
    }
    .done {
      color: olive;
      font-style: italic;
    }
    .cancelled {
      color: maroon;
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityStatusComponent {
  status = input.required<ActivityStatus>();
}
