import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  InputSignal,
  output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { RocketDto } from '@models/rocket.dto';

/**
 * Booking form component
 * Display the booking form and the total travelers
 */
@Component({
  selector: 'lab-book-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <main>
      <p>Rocket Capacity: {{ rocket().capacity }}</p>
      <p>Current Travelers: {{ currentTravelers() + bookedTravelers() }}</p>
      @if (canBeBooked()) {
        <label for="newTravelers">New Travelers:</label>
        <input
          id="newTravelers"
          type="number"
          min="0"
          [max]="maxNewTravelers()"
          [value]="newTravelers()"
          (change)="onNewTravelersChange($event)" />
        <p>Total travelers: {{ totalTravelers() }}</p>
      }
    </main>
    @if (canBeBooked()) {
      <footer>
        <span>
          <button (click)="onBookClick()" class="outline" [disabled]="isClean()">Book now!</button>
        </span>
        <span>
          <button (click)="onCleanClick()" class="outline secondary" [disabled]="isClean()">
            Clean
          </button>
        </span>
      </footer>
    }
  `,
})
export class BookFormComponent {
  // Inputs signals (sent from parent via [input])
  /**
   * Rocket object, sent from the parent component
   */
  rocket: InputSignal<RocketDto> = input.required<RocketDto>();
  /**
   * Current travelers, sent from the parent component
   */
  currentTravelers: InputSignal<number> = input.required<number>();
  // Outputs emitter (sent to parent via (output))
  /**
   * Output emitter for the book-travel event with the number of new travelers
   */
  bookTravel: OutputEmitterRef<number> = output<number>();

  // Writable signals (updated from the user input)
  /**
   * New travelers, updated from the user input
   */
  newTravelers: WritableSignal<number> = signal(0);
  /**
   * Booked travelers, updated when the book button is clicked
   */
  bookedTravelers: WritableSignal<number> = signal(0);

  // Computed signals (derived values)
  /**
   * Total travelers, computed from the current travelers and the new travelers
   */
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  /**
   * Max new travelers, computed from the rocket capacity and the current travelers
   */
  maxNewTravelers: Signal<number> = computed(
    () => this.rocket().capacity - this.currentTravelers(),
  );
  /**
   * Boolean signal to check if the form is clean (no travelers booked yet)
   */
  isClean: Signal<boolean> = computed(() => this.newTravelers() === 0);
  /**
   * Boolean signal to check if the form can be booked (no travelers booked yet)
   */
  canBeBooked: Signal<boolean> = computed(() => this.bookedTravelers() === 0);

  // Methods (event handlers)
  /**
   * Event handler for the new travelers change
   * - Ensures the new travelers value is not greater than the max new travelers
   * @param event - Event object (pointer to the input element)
   */
  onNewTravelersChange(event: Event) {
    const newTravelers = (event.target as HTMLInputElement).valueAsNumber;
    const max = this.maxNewTravelers();
    this.newTravelers.set(Math.min(newTravelers, max));
  }
  /**
   * Event handler for the book button
   * - Emits the new travelers value to the parent component
   * - Updates the booked travelers value
   */
  onBookClick() {
    this.bookTravel.emit(this.newTravelers());
    this.bookedTravelers.set(this.newTravelers());
  }
  /**
   * Event handler for the clean button
   * - Resets the new travelers value to 0
   */
  onCleanClick() {
    this.newTravelers.set(0);
  }
}
