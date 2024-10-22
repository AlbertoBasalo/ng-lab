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
@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LaunchHeaderComponent, BookFormComponent],
  template: `
    <article>
      <lab-launch-header [launch]="launch" />
      <lab-book-form
        [currentTravelers]="currentTravelers()"
        [rocket]="rocket"
        [(newTravelers)]="newTravelers"
        (book)="bookTravelers($event)" />
    </article>
  `,
})
export class BookingsComponent {
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

  currentTravelers: Signal<number> = signal(89);
  newTravelers: WritableSignal<number> = signal(0);
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  /*
  maxNewTravelers: Signal<number> = computed(() => this.rocket.capacity - this.currentTravelers()); */

  constructor() {
    effect(() => {
      if (this.totalTravelers() / this.rocket.capacity > 0.9) {
        this.launch.status = 'confirmed';
      } else if (this.totalTravelers() / this.rocket.capacity > 0.5) {
        this.launch.status = 'delayed';
      } else {
        this.launch.status = 'scheduled';
      }
    });
  }

  onNewTravelers(event: Event) {
    const n = (event.target as HTMLInputElement).valueAsNumber;
    this.newTravelers.set(n);
  }
  bookTravelers(newTravelers: number) {
    // this.newTravelers.update((current) => current + n);
    /* if (this.totalTravelers() / this.rocket.capacity > 0.9) {
      this.launch.status = 'confirmed';
    } */
    console.log(newTravelers);
    //this.currentTravelers.update((current) => current + newTravelers);
  }
  cancelBooking() {
    this.newTravelers.set(0);
    //this.currentTravelers.update((current) => current - this.newTravelers());
  }
}
