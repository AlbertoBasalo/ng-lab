import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-error',
  standalone: true,
  styles: `
    :host {
      color: var(--del-color)
    }
  `,
  template: `
    <aside id="error">
      <small> {{ message }}</small>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() message = 'Error';
}
