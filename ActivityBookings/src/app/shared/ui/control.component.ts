import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A wrapper around a form control.
 * @param {string} controlName The name of the control.
 * @param {string} labelDisplay The label to display.
 * @param {unknown} errors The errors to display if any.
 */
@Component({
  selector: 'lab-control',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe],
  template: `
    <label [for]="controlName()">
      <span>{{ labelDisplay() }}</span>
      @if (errors()) {
        <small>{{ errors() | json }}</small>
      }
      <ng-content />
    </label>
  `,
})
export class ControlComponent {
  // * Inputs division

  /** The form control name to bind to */
  controlName = input.required<string>();
  /** The label to display */
  labelDisplay = input.required<string>();
  /** The errors to display if any */
  errors = input<unknown>();
}
