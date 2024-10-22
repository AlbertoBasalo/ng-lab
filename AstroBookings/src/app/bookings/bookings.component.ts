import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
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
import { LaunchTitlePipe } from './launch-title.pipe';
@Component({
  selector: 'lab-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, LaunchTitlePipe],
  styles: `
    .scheduled {
      color: violet;
      font-style: italic;
    }
    .confirmed {
      color: green;
    }
    .delayed {
      color: limegreen;
      font-style: italic;
    }
    .launched {
      color: orange;
      font-style: italic;
    }
    .aborted {
      color: red;
      font-style: italic;
    }
  `,
  template: `
    <article>
      <header>
        <h2>{{ launch | launchTitle }}</h2>
        <div [class]="launch.status">
          <span>{{ launch.pricePerSeat | currency: 'USD' : 'symbol' : '1.0-0' }}</span>
          <span>{{ launch.date | date: 'dd/MMM/yyyy' }}</span>
          <span>{{ launch.status | uppercase }}</span>
        </div>
      </header>
      <main>
        <p>Current travelers: {{ currentTravelers() }}</p>
        <!--
        <p>New travelers: {{ newTravelers() }}</p>
        -->
        <input
          type="number"
          [value]="newTravelers()"
          (change)="onNewTravelers($event)"
          min="0"
          [max]="maxNewTravelers()" />
        <p>Total travelers: {{ totalTravelers() }}</p>
      </main>
      <footer>
        <span>
          <button class="outline" (click)="bookTravelers()">Book now!</button>
        </span>
        <span>
          <button class="outline secondary" (click)="cancelBooking()">Cancel</button>
        </span>
      </footer>
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
  maxNewTravelers: Signal<number> = computed(() => this.rocket.capacity - this.currentTravelers());

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
  bookTravelers() {
    // this.newTravelers.update((current) => current + n);
    /* if (this.totalTravelers() / this.rocket.capacity > 0.9) {
      this.launch.status = 'confirmed';
    } */
  }
  cancelBooking() {
    this.newTravelers.set(0);
    //this.currentTravelers.update((current) => current - this.newTravelers());
  }
}
