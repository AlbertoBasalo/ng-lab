import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'lab-control',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <label [for]="controlName()">{{ label() }}</label>
    <ng-content></ng-content>
    @if (control().errors) {
      <small>{{ control().errors | json }}</small>
    }
  `,
})
export class ControlBlock {
  label = input.required<string>();
  controlName = input.required<string>();
  control = input.required<NgModel>();
}
