import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  #http$ = inject(HttpClient);
  #apiActivitiesUrl = 'activities';
  #apiBookingsUrl = 'bookings';

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
        if (activities.length == 0) {
          console.error(`Activity not found: ${slug}`);
          throw new Error(`Activity not found: ${slug}`);
        }
      }),
      map((activities) => activities[0]),
    );
  }

  /**
   * Gets the bookings for the given activity
   * @param activityId The id of the activity to retrieve the bookings
   * @returns the bookings for the given activity
   */
  getBookingsByActivityId$(activityId: number): Observable<Booking[]> {
    const url = `${this.#apiBookingsUrl}?activityId=${activityId}`;
    return this.#http$.get<Booking[]>(url);
  }
}
