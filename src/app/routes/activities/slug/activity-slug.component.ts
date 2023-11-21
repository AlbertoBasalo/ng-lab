import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  signal,
} from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/activity.type';

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
    <article name="Activity details">
      <header>
        <h2>{{ title() | titlecase }}</h2>
        <p>{{ subtitle }}</p>
      </header>
      <section>
        <p>
          Price: <span class="data">{{ state().price | currency: 'EUR' }}</span>
        </p>
        <p>
          Date: <span class="data">{{ state().date | date: 'fullDate' }}</span>
        </p>
        <p>
          Minimum Participants:
          <span class="data">{{ state().minParticipants }}</span>
        </p>
        <p>
          Maximum Capacity:
          <span class="data">{{ state().maxParticipants }}</span>
        </p>
      </section>
      <footer>
        <button>Book</button>
      </footer>
    </article>
  `,
})
export class ActivitySlugComponent {
  @Input({ required: true })
  set activity(activity: Activity) {
    this.state.set(activity);
  }
  state = signal<Activity>(NULL_ACTIVITY);
  title = computed(() => this.state().name);
  subtitle = 'Book your activity now!';
}
