import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RunningState } from '@shared/services/command.state';
import { ErrorComponent } from './error.component';
import { WorkingComponent } from './working.component';

@Component({
  selector: 'lab-running-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WorkingComponent, ErrorComponent, JsonPipe],
  styles: [
    `
      :host {
        display: grid;
        justify-content: end;
      }
    `,
  ],
  template: `
    @for (runningState of runningStates; track runningState) {
      <div>
        @switch (runningState.stage) {
          @case ('working') {
            <lab-working />
          }
          @case ('error') {
            <lab-error [error]="runningState.error" />
          }
        }
      </div>
    }
  `,
})
export class RunningStateComponent {
  // @Input() runningState: RunningState = { stage: 'idle', error: null };
  @Input() runningStates: RunningState[] = [];
}
