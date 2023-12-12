import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-error',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <aside id="error">
      <input readonly type="text" aria-invalid="true" [value]="error.statusText || error.message || error" />
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() error: any = 'Unknown error';
}
