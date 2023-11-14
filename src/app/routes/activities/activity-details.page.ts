import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Signal,
  inject,
} from '@angular/core';
import { Activity, NULL_ACTIVITY } from '../../shared/activity.type';
import { State, toState } from '../../shared/state.function';
import { ActivityDetailsComponent } from './activity-details.component';
import { ActivityDetailsService } from './activity-details.service';

@Component({
  standalone: true,
  imports: [ActivityDetailsComponent],
  template: `
    @switch (state().status) {
      @case ('pending') {
        <aside id="loading">
          <p aria-busy="true">Loading activity...</p>
        </aside>
      }
      @case ('error') {
        <aside id="error">
          <p>Failed to load activity</p>
          <small>{{ state().error }}</small>
        </aside>
      }
      @default {
        <lab-activity-details [activity]="state().value" />
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActivityDetailsPage {
  @Input({ required: true })
  set slug(slug: string) {
    this.state = toState<Activity>(
      this.#service.getActivityBySlug$(slug),
      NULL_ACTIVITY,
    );
  }

  #service = inject(ActivityDetailsService);
  state!: Signal<State<Activity>>;
}
