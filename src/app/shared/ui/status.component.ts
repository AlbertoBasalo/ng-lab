import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RunningState } from '@shared/services/command.signal';
import { ErrorComponent } from './error.component';
import { WorkingComponent } from './working.component';

@Component({
  selector: 'lab-running-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WorkingComponent, ErrorComponent],
  template: `
    @switch (runningState.stage) {
      @case ('working') {
        <lab-working />
      }
      @case ('error') {
        <lab-error [error]="runningState.error" />
      }
    }
  `,
})
export class RunningStateComponent {
  @Input() runningState: RunningState = { stage: 'idle', error: null };
}
