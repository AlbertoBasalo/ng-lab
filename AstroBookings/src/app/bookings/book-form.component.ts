import { Component, computed, input, model, output } from '@angular/core';
import { RocketDto } from '../models/rocket.dto';

@Component({
  selector: 'lab-book-form',
  standalone: true,
  imports: [],
  template: `<main>
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
    </footer>`,
})
export class BookFormComponent {
  currentTravelers = input.required<number>();
  rocket = input.required<RocketDto>();
  newTravelers = model<number>(0);
  book = output<number>();
  maxNewTravelers = computed(() => this.rocket().capacity - this.currentTravelers());
  totalTravelers = computed(() => this.currentTravelers() + this.newTravelers());
  onNewTravelers(event: Event) {
    const n = (event.target as HTMLInputElement).valueAsNumber;
    this.newTravelers.set(n);
  }
  bookTravelers() {
    // this.newTravelers.update((current) => current + n);
    /* if (this.totalTravelers() / this.rocket.capacity > 0.9) {
      this.launch.status = 'confirmed';
    } */
    this.book.emit(this.newTravelers());
  }
  cancelBooking() {
    this.newTravelers.set(0);
    //this.currentTravelers.update((current) => current - this.newTravelers());
  }
}
