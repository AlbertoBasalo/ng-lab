import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-error',
  standalone: true,
  imports: [JsonPipe],
  styles: `
    :host {
      color: var(--del-color)
    }
  `,
  template: `
    <aside id="error">
      <small> {{ message | json }}</small>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() message = 'Error';
}
