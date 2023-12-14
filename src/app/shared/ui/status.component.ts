import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RunningState } from '@shared/services/command.signal';
import { ErrorComponent } from './error.component';
import { WorkingComponent } from './working.component';

@Component({
  selector: 'lab-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WorkingComponent, ErrorComponent],
  template: `
    @switch (commandStatus.status) {
      @case ('working') {
        <lab-working />
      }
      @case ('error') {
        <lab-error [error]="commandStatus.error" />
      }
    }
  `,
})
export class StatusComponent {
  @Input() commandStatus: RunningState = { stage: 'idle', error: null };
}
