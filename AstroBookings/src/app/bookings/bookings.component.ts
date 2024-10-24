import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { LaunchDto } from '../models/launch.dto';
import { RocketDto } from '../models/rocket.dto';
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
export class BookingsComponent {
  public launch: LaunchDto = {
    id: 'lnch_1',
    agencyId: 'usr_a1',
    rocketId: 'rkt_1',
    date: '2025-07-20T10:00:00Z',
    mission: 'Artemis I',
    destination: 'Moon Orbit',
    pricePerSeat: 28000000,
    status: 'delayed',
  };
  public rocket: RocketDto = {
    id: 'rkt_1',
    agencyId: 'usr_a1',
    name: 'Falcon Heavy',
    capacity: 100,
    range: 'mars',
  };

  public currentTravelers: Signal<number> = signal(89);
  private newTravelers: WritableSignal<number> = signal(0);
  private totalTravelers: Signal<number> = computed(
    () => this.currentTravelers() + this.newTravelers(),
  );

  private readonly launchStatusEffect = effect(() => {
    const occupation = this.totalTravelers() / this.rocket.capacity;
    if (occupation > 0.9) {
      this.launch.status = 'confirmed';
    } else {
      this.launch.status = 'delayed';
    }
  });

  public onBookTravel(newTravelers = 0) {
    console.log('Booked travelers:', newTravelers);
    this.newTravelers.set(newTravelers);
  }
}
