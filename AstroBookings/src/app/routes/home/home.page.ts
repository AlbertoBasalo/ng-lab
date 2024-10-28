import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOOKINGS_DB } from '@db/bookings';
import { LAUNCHES_DB } from '@db/launches';
import { BookingDto } from '@models/booking.dto';
import { LaunchDto } from '@models/launch.dto';
import { LaunchBlock } from '@ui/launch.block';

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
  launches: Signal<LaunchDto[]> = signal(LAUNCHES_DB);
  bookings: Signal<BookingDto[]> = signal(BOOKINGS_DB);
}
