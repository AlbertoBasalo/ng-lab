import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { LaunchDto, LaunchStatus } from '@models/launch.dto';
import { LaunchBlock } from '@ui/launch.block';

/**
 * Header component for the launch details
 */
@Component({
  selector: 'lab-launch-header',
  standalone: true,
  imports: [LaunchBlock],
  template: `
    <header>
      <lab-launch [launch]="launchWithStatus()"></lab-launch>
    </header>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchHeaderComponent {
  // Input signals (sent from parent via [input])
  launch: InputSignal<LaunchDto> = input.required<LaunchDto>();
  status: InputSignal<LaunchStatus> = input.required<LaunchStatus>();
  launchWithStatus: Signal<LaunchDto & { status: LaunchStatus }> = computed(() => ({
    ...this.launch(),
    status: this.status(),
  }));
}
