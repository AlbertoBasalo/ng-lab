import {
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
          <button (click)="onBookClick()" class="outline" [disabled]="hasNothingToBook()">
            Book now!
          </button>
        </span>
        <span>
          <button
            (click)="onCleanClick()"
            class="outline secondary"
            [disabled]="hasNothingToBook()">
            Clean
          </button>
        </span>
      </footer>
    }
  `,
})
export class BookFormComponent {
  // Inputs signals (sent from parent via [input])
  rocket: InputSignal<RocketDto> = input.required<RocketDto>();
  currentTravelers: InputSignal<number> = input.required<number>();
  // Outputs emitter (sent to parent via (output))
  bookTravel: OutputEmitterRef<number> = output<number>();

  // Signals
  newTravelers: WritableSignal<number> = signal(0);
  bookedTravelers: WritableSignal<number> = signal(0);

  // Computed (derived values)
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  maxNewTravelers: Signal<number> = computed(
    () => this.rocket().capacity - this.currentTravelers(),
  );

  hasNothingToBook: Signal<boolean> = computed(() => this.newTravelers() === 0);
  canBeBooked: Signal<boolean> = computed(() => !this.bookedTravelers());

  // Methods (event handlers)
  onNewTravelersChange(event: Event) {
    const max = this.maxNewTravelers();
    const newTravelers = (event.target as HTMLInputElement).valueAsNumber;
    this.newTravelers.set(Math.min(newTravelers, max));
  }
  onBookClick() {
    this.bookTravel.emit(this.newTravelers());
    this.bookedTravelers.set(this.newTravelers());
  }
  onCleanClick() {
    this.newTravelers.set(0);
  }
}
