import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Activity } from '../../shared/activity.type';
import { ActivitiesList } from './activities.list';
import { ActivitiesService } from './activities.service';

@Component({
  standalone: true,
  imports: [CommonModule, ActivitiesList],
  providers: [ActivitiesService],
  template: `
    <article name="Published activities">
      <header>
        <h2>Book an activity and enjoy!</h2>
      </header>
      @if(activities().length>0){
      <lab-activities [activities]="activities()" />
      } @else {
      <p>No activities available yet</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #activities = inject(ActivitiesService);
  activities: Signal<Activity[]> = toSignal(this.#activities.getActivities$(), {
    initialValue: [],
  });
}
