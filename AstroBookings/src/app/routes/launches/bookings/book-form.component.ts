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
      <p>Current Travelers: {{ currentTravelers() }}</p>
      <label for="newTravelers">New Travelers:</label>
      <input
        id="newTravelers"
        type="number"
        min="0"
        [max]="maxNewTravelers()"
        [value]="newTravelers()"
        (change)="onNewTravelersChange($event)" />
      <p>Total travelers: {{ totalTravelers() }}</p>
    </main>
    <footer>
      <span>
        <button (click)="onBookClick()" class="outline">Book now!</button>
      </span>
      <span>
        <button (click)="onCleanClick()" class="outline secondary">Clean</button>
      </span>
    </footer>
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
  // Computed (derived values)
  totalTravelers: Signal<number> = computed(() => this.currentTravelers() + this.newTravelers());
  maxNewTravelers: Signal<number> = computed(
    () => this.rocket().capacity - this.currentTravelers(),
  );

  // Methods (event handlers)
  onNewTravelersChange(event: Event) {
    const max = this.maxNewTravelers();
    const newTravelers = (event.target as HTMLInputElement).valueAsNumber;
    this.newTravelers.set(Math.min(newTravelers, max));
  }
  onBookClick() {
    this.bookTravel.emit(this.newTravelers());
  }
  onCleanClick() {
    this.newTravelers.set(0);
  }
}
