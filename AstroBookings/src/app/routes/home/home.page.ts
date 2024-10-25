import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import LAUNCHES_DB from '../../../db/launches.json';
import { LaunchDto } from '../../shared/models/launch.dto';
import { LaunchBlock } from '../../shared/ui/launch.block';

@Component({
  standalone: true,
  imports: [RouterLink, LaunchBlock],
  template: `
    @for (launch of launches(); track launch.id) {
      <article>
        <lab-launch [launch]="launch"></lab-launch>
        <footer>
          <button class="outline" [routerLink]="['launches', launch.id, 'bookings']">
            Book now!
          </button>
        </footer>
      </article>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomePage {
  launches: Signal<LaunchDto[]> = signal(LAUNCHES_DB);
}
