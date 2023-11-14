import {
  ChangeDetectionStrategy,
  Component,
  Injector,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
          <small>Failed to load {{ state().error }}</small>
        </aside>
      }
      @default {
        <lab-activity-details [activity]="state().value" />
      }
    }
  `,
})
export default class ActivityDetailsPage {
  /** The activity slug received from a router param */
  @Input({ required: true })
  set slug(slug: string) {
    // With this paradigm, we are not leveraging the observable router
    // Every time the slug changes, we need to reset the state
    this.state = toState<Activity>(
      this.#service.getActivityBySlug$(slug), // the observable
      NULL_ACTIVITY, // the initial value
      this.injector, // here we are not in an injection context
    );
  }
  constructor(private readonly injector: Injector) {
    // We need our current injector to be able pass it to the `toState` function
  }

  #service = inject(ActivityDetailsService);
  state!: Signal<State<Activity>>;
}
