import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-error',
  standalone: true,
  imports: [JsonPipe],
  styles: [
    `
      .invalid {
        background-image: var(--icon-invalid);
        text-align: right;
        padding-left: 2em;
      }
    `,
  ],
  template: `
    <aside id="error" class="invalid">
      <small>{{ error.error || error.statusText || error.message || error }}</small>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() error: any = 'Unknown error';
}
