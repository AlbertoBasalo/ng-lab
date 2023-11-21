import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Activity } from '../../../shared/activity.type';

@Component({
  selector: 'lab-activity-slug',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <article name="Activity details">
      <header>
        <h2>{{ activity.name }}</h2>
        <p>Book your activity now!</p>
      </header>
      <section>
        <p>Price: {{ activity.price | currency: 'EUR' }}</p>
        <p>Date: {{ activity.date | date: 'fullDate' }}</p>
        <p>
          Participants: min: {{ activity.minParticipants }} max:
          {{ activity.maxParticipants }}
        </p>
      </section>
      <footer>
        <button>Book</button>
      </footer>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitySlugComponent {
  @Input({ required: true }) activity!: Activity;
}
