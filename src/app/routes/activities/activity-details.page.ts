import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '../../shared/activity.type';
import { State, toState } from '../../shared/state.function';
import { ActivityDetailsComponent } from './activity-details.component';
import { ActivityDetailsService } from './activity-details.service';

@Component({
  standalone: true,
  imports: [CommonModule, ActivityDetailsComponent],
  template: `
     @switch (state().status) {
        @case ('pending') {
          <aside id="loading">
            <p aria-busy="true">Loading activity {{slug}}...</p>
          </aside>
        }
        @case ('error') {
          <aside id="error">
            <p>Failed to load activity {{slug}}</p>
            <small>{{ state().error }}</small>
          </aside>
        }
        @default {
          <lab-activity-details [activity]="state().value"/>
        }
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ActivityDetailsPage {
  #slug!: string;
  @Input({ required: true })
  set slug(slug: string) {
    this.#slug = slug;
    this.state = toState<Activity>(this.#service.getActivity$(slug), NULL_ACTIVITY);
  }
  get slug() {
    return this.#slug;
  }

  #service = inject(ActivityDetailsService);
  state!: Signal<State<Activity>>;
}
