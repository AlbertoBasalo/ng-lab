import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Activity } from '@shared/activity/activity.type';
import { Booking } from '@shared/booking/booking.type';

@Component({
  selector: 'lab-profile',
  standalone: true,
  imports: [RouterLink, JsonPipe, DatePipe],
  template: `
    <h2>These are the activities you organize</h2>
    <div class="grid">
      @for (activity of activities; track activity.id) {
        <article [id]="activity.id" class="activity">
          <header>
            <h3>{{ activity.name }}</h3>
          </header>
          <p>{{ activity.date | date: 'yyyy/MM/dd' }}</p>
          <p>{{ activity.location }}</p>
        </article>
      }
    </div>
    <h2>These are the activities you booked</h2>
    <div class="grid">
      @for (booking of bookings; track booking.id) {
        <article [id]="booking.id" class="booking">
          <header>
            <h3>Booked on {{ booking.date | date: 'yyyy/MM/dd' }}</h3>
          </header>
          <p>Reserved for: {{ booking.participants }} participant/s.</p>
        </article>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  @Input() activities: Activity[] = [];
  @Input() bookings: Booking[] = [];
}
