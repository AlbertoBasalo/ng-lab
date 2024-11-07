import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LaunchDto } from '@models/launch.dto';
import { LaunchBlock } from '@ui/launch.block';
import { HomeService } from './home.service';

/**
 * Home page with a list of launches
 * Each launch has a link to the bookings page
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LaunchBlock],
  styles: `
    .list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(512px, 1fr));
      gap: 1rem;
    }
  `,
  template: `
    <section class="list">
      @for (launch of launches(); track launch.id) {
        <article>
          <lab-launch [launch]="launch"></lab-launch>
          @if (['confirmed', 'delayed', 'scheduled'].includes(launch.status)) {
            <footer>
              <a role="button" class="outline" [routerLink]="['launches', launch.id, 'bookings']">
                Book now!
              </a>
            </footer>
          }
        </article>
      }
    </section>
  `,
})
export default class HomePage {
  // Injectable services
  /**
   * Facade service for the home page
   */
  readonly homeService = inject(HomeService);

  // Read-only signals

  /**
   * List of launches, filled by the getLaunches service method
   */
  readonly launches: Signal<LaunchDto[]> = this.homeService.getLaunches();
}
