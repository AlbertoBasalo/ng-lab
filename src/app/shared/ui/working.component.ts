import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-working',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <aside id="working">
      <small aria-busy="true">{{ message }} ...</small>
      <progress></progress>
    </aside>
  `,
})
export class WorkingComponent {
  @Input() message = 'Working';
}
