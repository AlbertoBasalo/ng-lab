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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LaunchBlock],
  template: `
    <header>
      <lab-launch [launch]="launchWithStatus()"></lab-launch>
    </header>
  `,
})
export class LaunchHeaderComponent {
  // Input signals (sent from parent via [input])
  /**
   * Launch object, sent from the parent component
   */
  launch: InputSignal<LaunchDto> = input.required<LaunchDto>();
  /**
   * Launch status, sent from the parent component
   */
  status: InputSignal<LaunchStatus> = input.required<LaunchStatus>();
  // Computed signals
  /**
   * Launch object with the status, computed from the launch and the status
   */
  launchWithStatus: Signal<LaunchDto & { status: LaunchStatus }> = computed(() => ({
    ...this.launch(),
    status: this.status(),
  }));
}
