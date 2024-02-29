import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, InputSignal, ModelSignal, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@domain/activity.type';
import { ActivityStatusComponent } from '@ui/activity-status.component';

@Component({
  selector: 'lab-activity',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, ActivityStatusComponent],
  template: `
    <div>
      <span>
        <input
          type="checkbox"
          name=""
          class="secondary outline"
          [checked]="favorites().includes(activity().slug)"
          (click)="toggleFavorite(activity().slug)" />
      </span>
      <span>
        <a [routerLink]="['/bookings', activity().slug]">{{ activity().name }}</a>
      </span>
      <span>{{ activity().location }}</span>
      <span>{{ activity().price | currency }}</span>
      <span>{{ activity().date | date: 'dd-MMM-yyyy' }}</span>
      <lab-activity-status [status]="activity().status" />
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityComponent {
  // * Input signals division

  /** The current Activity to be presented*/
  activity: InputSignal<Activity> = input.required<Activity>();

  // * Model signals division

  /** The list of favorites */
  favorites: ModelSignal<string[]> = model.required<string[]>();

  // * Methods division

  /** Toggles the favorite status of the given activity */
  toggleFavorite(slug: string): void {
    this.favorites.update((favorites) => {
      if (favorites.includes(slug)) {
        return favorites.filter((favorite) => favorite !== slug);
      }
      return favorites.concat(slug);
    });
  }
}
