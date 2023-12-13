import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-error',
  standalone: true,
  imports: [JsonPipe],
  styles: [
    `
      :host {
        display: grid;
        justify-content: end;
      }
      input {
        border: none;
      }
      input::placeholder {
        text-align: right;
      }
    `,
  ],
  template: `
    <aside id="error">
      <span>
        <input readonly aria-invalid="true" [placeholder]="error.error || error.statusText || error.message || error" />
      </span>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() error: any = 'Unknown error';
}
