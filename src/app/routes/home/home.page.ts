import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Activity } from '../../shared/activity.type';
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
      @if(activitiesState().value.length > 0){
      <lab-activities [activities]="activitiesState().value" />
      } @else {
      <p>No activities available yet</p>
      }
      <pre>
        <code>{{ activitiesState() | json }}</code>
      </pre>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #activities = inject(ActivitiesService);
  activitiesState = signal$<Activity[]>(this.#activities.getActivities$(), []);
}

type State<T> = {
  value: T;
  error?: any;
  status: 'pending' | 'success' | 'error';
};
function signal$<T>(observable$: Observable<T>, value: T) {
  const theSignal = signal<State<T>>({ value, status: 'pending' });
  const subscription: Subscription = observable$.subscribe({
    next: (value) =>
      theSignal.update((s) => ({ ...s, value, status: 'success' })),
    error: (error) => {
      theSignal.update((s) => ({ ...s, error, status: 'error' }));
      subscription.unsubscribe();
    },
    complete: () => subscription.unsubscribe(),
  });
  return theSignal;
}
