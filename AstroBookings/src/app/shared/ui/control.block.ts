import { JsonPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'lab-control',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <label [for]="controlName()">{{ labelCaption() }}</label>
    <ng-content></ng-content>
    @if (control().errors) {
      <small>{{ control().errors | json }}</small>
    }
  `,
})
export class ControlBlock {
  // Input signals

  /**
   * Label caption
   * - If not provided, control name will be used
   */
  label = input<string>();

  /**
   * NgModel control
   */
  control = input.required<NgModel>();

  // Computed signals

  controlName = computed(() => this.control().name);
  labelCaption = computed(
    () => this.label() || this.controlName().charAt(0).toUpperCase() + this.controlName().slice(1),
  );
}
