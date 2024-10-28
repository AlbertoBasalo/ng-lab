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

import { BOOKINGS_DB } from '@db/bookings';
import { LAUNCHES_DB } from '@db/launches';
import { ROCKETS_DB } from '@db/rockets';
import { BookingDto } from '@models/booking.dto';
import { LaunchDto, LaunchStatus, NULL_LAUNCH } from '@models/launch.dto';
import { NULL_ROCKET, RocketDto } from '@models/rocket.dto';
import { BookFormComponent } from './book-form.component';
import { LaunchHeaderComponent } from './launch-header.component';
/**
 * Bookings page componente
 * Display the launch details and the booking form
 */
@Component({
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
  /**
   * Launch id, comes from the route :id param
   */
  id: InputSignal<string> = input.required<string>();

  // Writable signals
  /**
   * New travelers, comes from the book form
   */
  newTravelers: WritableSignal<number> = signal(0);

  // Computed signals
  /**
   * Launch object, computed from the id
   * Default to NULL_LAUNCH if not found
   */
  launch: Signal<LaunchDto> = computed(
    () => LAUNCHES_DB.find((launch) => launch.id === this.id()) || NULL_LAUNCH,
  );
  /**
   * Rocket object, computed from the launch
   * Default to NULL_ROCKET if not found
   */
  rocket: Signal<RocketDto> = computed(
    () => ROCKETS_DB.find((rocket) => rocket.id === this.launch().rocketId) || NULL_ROCKET,
  );
  /**
   * Current travelers, computed from the rocket capacity and a random number
   */
  currentTravelers: Signal<number> = computed(() => {
    // get the bookings for the launch
    const bookings = BOOKINGS_DB.filter((booking) => booking.launchId === this.id());
    // return the number of travelers
    return bookings.reduce((acc, booking) => acc + booking.numberOfSeats, 0);
  });
  /**
   * Total travelers, computed from the current travelers and the new travelers
   */
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  /**
   * Launch status, computed from the total travelers and the rocket capacity
   * It is used as a readonly signal in the launch header component
   */
  launchStatus: Signal<LaunchStatus> = computed(() => {
    const occupation = this.totalTravelers() / this.rocket().capacity;
    if (occupation >= 0.8) {
      return 'confirmed';
    } else {
      return 'delayed';
    }
  });

  // Effects
  /**
   * Effect to save the launch status to the database
   * - It is triggered when any signal changes
   * - It changes the database if the launch status changes
   * - It creates a new booking if a traveler books a seat
   * - Both are side effects
   */
  saveLaunchEffect = effect(() => {
    const newTravelers = this.newTravelers();
    const launch = this.launch();
    const status = this.launchStatus();
    if (launch.status !== status) {
      const updatedLaunch = { ...launch, status };
      const launchIndex = LAUNCHES_DB.findIndex((l) => l.id === launch.id);
      if (launchIndex === -1) return;
      LAUNCHES_DB[launchIndex] = updatedLaunch;
    }
    const newBooking: BookingDto = {
      id: `bkg_${BOOKINGS_DB.length + 1}`,
      travelerId: `usr_t1`,
      launchId: launch.id,
      numberOfSeats: newTravelers,
      totalPrice: launch.pricePerSeat * newTravelers,
      status: 'pending',
    };
    BOOKINGS_DB.push(newBooking);
  });

  // Methods (event handlers)
  /**
   * Event handler for the book form
   * - Triggers when the user books a new traveler
   * @param newTravelers - Number of new travelers
   */
  onBookTravel(newTravelers = 0) {
    console.log('Booked travelers:', newTravelers);
    this.newTravelers.set(newTravelers);
  }
}
