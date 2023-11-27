import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-pending',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside id="loading">
      <p aria-busy="true">{{ message }} ...</p>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PendingComponent {
  @Input() message = 'Loading';
}
