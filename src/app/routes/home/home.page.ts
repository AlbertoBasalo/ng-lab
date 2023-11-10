import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Activity } from '../../shared/activity.type';
import { toState } from '../../shared/state.function';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  imports: [CommonModule, ActivitiesList],
  template: `
    <article name="Published activities">
      <header>
        <h2>Book an activity and enjoy!</h2>
      </header>
      @switch (state().status) {
        @case ('pending') {
          <aside id="loading">
            <p aria-busy="true">Loading activities...</p>
          </aside>
        }
        @case ('error') {
          <aside id="error">
            <p>Failed to load activities</p>
            <small>{{ state().error }}</small>
          </aside>
        }
        @default {
          <lab-activities [activities]="state().value"/>
        }
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #service = inject(ActivitiesService);
  state = toState<Activity[]>(this.#service.getActivities$(), []);
}
