import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Activity } from '../../shared/activity.type';
import { toState } from '../../shared/state.function';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <article name="Published activities">
      <header>
        <h2>Book an activity and enjoy!</h2>
      </header>
      @switch (state().status) {
        @case ('pending') {
          <p aria-busy="true">Loading activities...</p>
        }
        @case ('error') {
          <p>Failed to load activities</p>
        }
        @default {
          @if (state().value.length === 0) {
            <ul>
              @for(activity of state().value; track activity.id){
                <li>
                  <a href="/activities/{activity.id}">{{ activity.name }}</a>
                </li>
              }
            </ul>
          } @else {
            <p>No activities found</p>
          }
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
