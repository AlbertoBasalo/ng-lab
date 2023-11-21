import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@shared/activity.type';

@Component({
  selector: 'lab-profile',
  standalone: true,
  imports: [RouterLink, JsonPipe],
  template: `
    <h2>These are the activities you organize</h2>
    <div class="grid">
      @for (activity of activities; track activity.id) {
        <article [id]="activity.id">
          <header>
            <h3>{{ activity.name }}</h3>
          </header>
          <pre>{{ activity | json }}</pre>
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Input() activities: Activity[] = [];
}
