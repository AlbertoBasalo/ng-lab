import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import LAUNCHES_DB from '../../../../db/launches.json';
import { LaunchDto } from '../../../shared/models/launch.dto';
import { RocketDto } from '../../../shared/models/rocket.dto';
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
      <lab-launch-header [launch]="launch" />
      <lab-book-form
        [rocket]="rocket"
        [currentTravelers]="currentTravelers()"
        (bookTravel)="onBookTravel($event)" />
    </article>
  `,
})
export default class BookingsPage {
  launch: LaunchDto = {
    id: 'lnch_1',
    agencyId: 'usr_a1',
    rocketId: 'rkt_1',
    date: '2025-07-20T10:00:00Z',
    mission: 'Artemis I',
    destination: 'Moon Orbit',
    pricePerSeat: 28000000,
    status: 'delayed',
  };
  rocket: RocketDto = {
    id: 'rkt_1',
    agencyId: 'usr_a1',
    name: 'Falcon Heavy',
    capacity: 100,
    range: 'mars',
  };

  // Readonly signals
  currentTravelers: Signal<number> = signal(89);

  // Writable signals
  newTravelers: WritableSignal<number> = signal(0);

  // Computed signals
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());

  constructor(activatedRoute: ActivatedRoute) {
    const launchId: string = activatedRoute.snapshot.params['id'] || '';
    this.launch = LAUNCHES_DB.find((launch) => launch.id === launchId) || this.launch;
  }

  // Effects (run on signals changes)
  private readonly launchStatusEffect = effect(() => {
    const occupation = this.totalTravelers() / this.rocket.capacity;
    const currentStatus = this.launch.status;
    let newStatus = currentStatus;
    if (occupation > 0.9) {
      newStatus = 'confirmed';
    } else {
      newStatus = 'delayed';
    }
    if (newStatus !== currentStatus) {
      // clone the launch object to trigger change detection
      this.launch = { ...this.launch, status: newStatus };
    }
  });

  // Methods (event handlers)
  onBookTravel(newTravelers = 0) {
    console.log('Booked travelers:', newTravelers);
    this.newTravelers.set(newTravelers);
  }
}
