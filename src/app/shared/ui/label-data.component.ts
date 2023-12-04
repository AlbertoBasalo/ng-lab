import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-label-data',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    #label {
      text-align: left;
    }
    #data {
      text-align: right;
      font-weight: bold;
    }
    #unit {
      text-align: left;
    }
  `,
  template: `
    <div>
      <span id="label">{{ label }}:</span>
      <span id="data">{{ data }}</span>
      <span id="unit">{{ unit }}</span>
    </div>
  `,
})
export class LabelDataComponent {
  @Input() label: string | undefined;
  @Input() data: unknown | undefined;
  @Input() unit: string | undefined;
}
