import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, Signal, computed } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';

@Component({
  selector: 'lab-activity-slug',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  styles: `
    .data {
      font-weight: bold;
    }
  `,
  template: `
    <article name="ActivityDetails">
      <header>
        <h3>{{ title() }}</h3>
        <p>{{ subtitle() }}</p>
      </header>
      <section>
        <p>
          Price: <span class="data">{{ activity().price | currency: 'EUR' }}</span>
        </p>
        <p>
          Date: <span class="data">{{ activity().date | date: 'fullDate' }}</span>
        </p>
        <p>
          Minimum Participants:
          <span class="data">{{ activity().minParticipants }}</span>
        </p>
        <p>
          Maximum Capacity:
          <span class="data">{{ activity().maxParticipants }}</span>
        </p>
      </section>
      <footer>
        @if (availablePlaces() > 0) {
          <button id="bookingActivity" (click)="onBookingClick()">Book</button>
        }
      </footer>
    </article>
  `,
})
export class ActivitySlugComponent {
  // I/O division
  @Input({ required: true }) activity!: Signal<Activity>;
  @Input({ required: true }) participants!: Signal<number>;
  @Output() booking = new EventEmitter<void>();

  // ToDo: improve template without article sections

  // Data division
  title = computed(() => `There are ${this.participants()} participants `);
  subtitle = computed(() => `There are ${this.availablePlaces()} places available`);
  availablePlaces = computed(() => this.activity().maxParticipants - this.participants());

  // Event handlers division
  onBookingClick() {
    this.booking.emit();
  }
}
