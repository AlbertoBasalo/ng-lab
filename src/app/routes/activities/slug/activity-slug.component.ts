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
        <h3>{{ title() | titlecase }}</h3>
        <p>{{ subtitle }}</p>
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
        <button id="bookingActivity" (click)="onBookingClick()">Book</button>
      </footer>
    </article>
  `,
})
export class ActivitySlugComponent {
  // I/O division
  @Input({ required: true }) activity!: Signal<Activity>;
  @Output() booking = new EventEmitter<void>();

  // Data division
  title = computed(() => this.activity().name);
  subtitle = 'Book your activity now!';

  // Event handlers division
  onBookingClick() {
    this.booking.emit();
  }
}
