import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { LAUNCHES_DB } from '@db/launches';
import { ROCKETS_DB } from '@db/rockets';
import { LaunchDto, LaunchStatus, NULL_LAUNCH } from '@models/launch.dto';
import { NULL_ROCKET, RocketDto } from '@models/rocket.dto';
import { BookFormComponent } from './book-form.component';
import { LaunchHeaderComponent } from './launch-header.component';
/**
 * Bookings page componente
 * Display the launch details and the booking form
 */
@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LaunchHeaderComponent, BookFormComponent],
  template: `
    <article>
      <lab-launch-header [launch]="launch()" [status]="launchStatus()" />
      <lab-book-form
        [rocket]="rocket()"
        [currentTravelers]="currentTravelers()"
        (bookTravel)="onBookTravel($event)" />
    </article>
  `,
})
export default class BookingsPage {
  // Input signals
  id: InputSignal<string> = input.required<string>();

  // Writable signals
  newTravelers: WritableSignal<number> = signal(0);

  // Computed signals
  launch: Signal<LaunchDto> = computed(
    () => LAUNCHES_DB.find((launch) => launch.id === this.id()) || NULL_LAUNCH,
  );
  rocket: Signal<RocketDto> = computed(
    () => ROCKETS_DB.find((rocket) => rocket.id === this.launch().rocketId) || NULL_ROCKET,
  );
  currentTravelers: Signal<number> = computed(() =>
    Math.floor(this.rocket().capacity * Math.random()),
  );
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  launchStatus: Signal<LaunchStatus> = computed(() => {
    const occupation = this.totalTravelers() / this.rocket().capacity;
    if (occupation > 0.9) {
      return 'confirmed';
    } else {
      return 'delayed';
    }
  });

  // Effects
  saveLaunchEffect = effect(() => {
    if (this.launchStatus() !== this.launch().status) {
      const updatedLaunch = {
        ...this.launch(),
        status: this.launchStatus(),
      };
      const launchIndex = LAUNCHES_DB.findIndex((launch) => launch.id === this.id());
      if (launchIndex !== -1) {
        LAUNCHES_DB[launchIndex] = updatedLaunch;
      }
    }
  });

  // Methods (event handlers)
  onBookTravel(newTravelers = 0) {
    console.log('Booked travelers:', newTravelers);
    this.newTravelers.set(newTravelers);
  }
}
