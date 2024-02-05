import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '../../shared/domain/activity.type';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  template: `
    <article>
      <header>
        <h2>Activities</h2>
      </header>
      <main>
        @for (activity of activities(); track activity.id) {
          <div>
            <span>
              <a [routerLink]="['/bookings', activity.slug]">{{ activity.name }}</a>
            </span>
            <span>{{ activity.location }}</span>
            <span>{{ activity.price | currency }}</span>
            <span>{{ activity.date | date: 'dd-MMM-yyyy' }}</span>
          </div>
        }
      </main>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';
  activities: WritableSignal<Activity[]> = signal<Activity[]>([]);

  constructor() {
    this.#http$.get<Activity[]>(this.#apiUrl).subscribe((activities) => {
      this.activities.set(activities);
    });
  }
}
