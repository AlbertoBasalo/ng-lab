import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  Signal,
  computed,
  inject,
} from '@angular/core';

import { Activity, NULL_ACTIVITY } from '@shared/activity.type';
import { ErrorComponent } from '@shared/error.component';
import { PendingComponent } from '@shared/pending.component';
import { State, toState } from '@shared/state.signal';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivitySlugComponent, PendingComponent, ErrorComponent],
  providers: [ActivitySlugService],
  template: `
    @switch (state().status) {
      @case ('pending') {
        <lab-pending message="Loading activity {{ slug }}" />
      }
      @case ('error') {
        <lab-error [message]="errorMessage()" />
      }
      @default {
        <lab-activity-slug [activity]="state().value" />
      }
    }
  `,
})
export default class ActivitySlugPage {
  #service = inject(ActivitySlugService);
  // ToDo: use router params$ instead of @Input

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

  state!: Signal<State<Activity>>;

  constructor(private readonly injector: Injector) {
    // We need our current injector to be able pass it to the `toState` function
  }
  errorMessage = computed(() => `Failed to load ${this.state().error}`);
}
