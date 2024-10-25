import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { LaunchDto } from '../../../shared/models/launch.dto';
import { LaunchBlock } from '../../../shared/ui/launch.block';

/**
 * Header component for the launch details
 */
@Component({
  selector: 'lab-launch-header',
  standalone: true,
  imports: [LaunchBlock],
  template: `
    <header>
      <lab-launch [launch]="launch()"></lab-launch>
    </header>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchHeaderComponent {
  // Input signals (sent from parent via [input])
  launch: InputSignal<LaunchDto> = input.required<LaunchDto>();
}
