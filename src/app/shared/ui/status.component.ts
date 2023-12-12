import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CallStatus } from '@shared/services/command.signal';
import { ErrorComponent } from './error.component';
import { WorkingComponent } from './working.component';

@Component({
  selector: 'lab-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [WorkingComponent, ErrorComponent],
  template: `
    @switch (callStatus.status) {
      @case ('working') {
        <lab-working />
      }
      @case ('error') {
        <lab-error [error]="callStatus.error" />
      }
    }
  `,
})
export class StatusComponent {
  @Input() callStatus: CallStatus = { status: 'idle', error: null };
}
