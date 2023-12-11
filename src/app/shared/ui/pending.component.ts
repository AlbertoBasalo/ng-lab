import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-pending',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <aside id="loading">
      <p aria-busy="true">{{ message }} ...</p>
    </aside>
  `,
})
export class PendingComponent {
  @Input() message = 'Loading';
}
