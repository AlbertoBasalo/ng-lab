import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';

import { LaunchDto, LaunchStatus, NULL_LAUNCH } from '@models/launch.dto';
import { NULL_ROCKET, RocketDto } from '@models/rocket.dto';
import { map, tap } from 'rxjs';
import { BookFormComponent } from './book-form.component';
import { BookingsService } from './bookings.service';
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
  // Injectable services
  /**
   * Facade service for the bookings page
   */
  readonly bookingsService = inject(BookingsService);

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

  // launch: Signal<LaunchDto> = computed(
  //   () => LAUNCHES_DB.find((launch) => launch.id === this.id()) || NULL_LAUNCH,
  // );

  /**
   * Launch signal, set by the getLaunchEffect
   */
  launch: WritableSignal<LaunchDto> = signal(NULL_LAUNCH);

  // rocket: Signal<RocketDto> = computed(
  //   () => ROCKETS_DB.find((rocket) => rocket.id === this.launch().rocketId) || NULL_ROCKET,
  // );

  /**
   * Rocket signal, set by the getRocketEffect
   */
  rocket: WritableSignal<RocketDto> = signal(NULL_ROCKET);

  /**
   * Current travelers, set by the getBookingsEffect
   */
  currentTravelers: WritableSignal<number> = signal(0);

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
   * Effect to get the launch from the API when the id changes
   */
  getLaunchEffect = effect(
    () => {
      const id = this.id();
      if (!id) return;
      this.bookingsService.getLaunch$(id).subscribe((launch) => this.launch.set(launch));
    },
    {
      allowSignalWrites: true,
    },
  );

  /**
   * Effect to get the rocket from the API when the launch changes
   */
  getRocketEffect = effect(
    () => {
      const rocketId = this.launch().rocketId;
      if (!rocketId) return;
      this.bookingsService.getRocket$(rocketId).subscribe((rocket) => this.rocket.set(rocket));
    },
    {
      allowSignalWrites: true,
    },
  );

  /**
   * Effect to get the bookings from the API when the launch changes
   */
  getBookingsEffect = effect(
    () => {
      const id = this.id();
      if (!id) return;
      this.bookingsService
        .getBookings$(id)
        .pipe(
          map((bookings) => bookings.reduce((acc, booking) => acc + booking.numberOfSeats, 0)),
          tap((reservedSeats) => this.currentTravelers.set(reservedSeats)),
        )
        .subscribe();
    },
    {
      allowSignalWrites: true,
    },
  );

  /**
   * Effect to save the launch status to the database
   * - It is triggered when any signal changes
   * - It changes the database if the launch status changes
   * - It creates a new booking if a traveler books a seat
   * - Both are side effects
   */
  saveLaunchEffect = effect(() => {
    // signal triggers
    const newTravelers = this.newTravelers();
    const launch = this.launch();
    const status = this.launchStatus();
    // side effects
    this.bookingsService.updateLaunchStatus(launch, status).subscribe();
    this.bookingsService.createBooking(launch, newTravelers).subscribe();
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
