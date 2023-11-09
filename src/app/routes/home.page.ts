import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

type Activity = {
  id: string;
  name: string;
};

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <article name="Published activities">
      <header>
        <h2>Book an activity and enjoy!</h2>
      </header>
      @if(activities().length>0){
      <ul>
        @for(activity of activities(); track activity.id){
        <li>
          <a href="/activities/{activity.id}">{{ activity.name }}</a>
        </li>
        }
      </ul>
      } @else {
      <p>No activities available yet</p>
      }
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  activities = signal<Activity[]>([]);

  constructor() {
    // Simulate a slow fetch from a server
    setTimeout(() => {
      this.activities.set([
        { id: '1', name: 'Hiking' },
        { id: '2', name: 'Biking' },
        { id: '3', name: 'Swimming' },
      ]);
    }, 1000);
  }
}
