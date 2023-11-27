import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '@core/auth/auth.store';
import { Activity } from '@shared/activity/activity.type';
import { Booking } from '@shared/booking/booking.type';
import { Observable, map, tap } from 'rxjs';

export class ActivitySlugService {
  #http$ = inject(HttpClient);
  #authStore = inject(AuthStore);
  #apiActivitiesUrl = 'http://localhost:3000/activities';
  #apiBookingsUrl = 'http://localhost:3000/bookings';

  /**
   * Gets an activity by its slug
   * @param slug the slug of the activity to retrieve
   * @returns An observable activity with the given slug
   * @throws Error if the activity is not found
   */
  getActivityBySlug$(slug: string): Observable<Activity> {
    const url = `${this.#apiActivitiesUrl}?slug=${slug}`;
    return this.#http$.get<Activity[]>(url).pipe(
      tap((activities) => {
        if (activities.length == 0)
          throw new Error(`Activity not found: ${slug}`);
      }),
      map((activities) => activities[0]),
    );
  }

  /**
   * Posts a booking for the given activity
   * @param activity the activity to book
   * @returns An observable booking
   */
  postBookActivity$(activity: Activity): Observable<Booking> {
    const url = `${this.#apiBookingsUrl}`;
    const booking: Partial<Booking> = {
      activityId: activity.id,
      userId: this.#authStore.user().id,
      date: new Date(),
      participants: 1,
    };
    return this.#http$.post<Booking>(url, booking);
  }
}
