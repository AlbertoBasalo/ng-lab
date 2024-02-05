import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Activity, NULL_ACTIVITY } from '../../domain/activity.type';
import { Booking } from '../../domain/booking.type';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  #http$ = inject(HttpClient);
  #activitiesUrl = 'http://localhost:3000/activities';
  #bookingsUrl = 'http://localhost:3000/bookings';

  getActivityBySlug$(slug: string | undefined) {
    if (!slug) return of(NULL_ACTIVITY);
    const url = `${this.#activitiesUrl}?slug=${slug}`;
    return this.#http$.get<Activity[]>(url).pipe(
      map((activities) => activities[0] || NULL_ACTIVITY),
      catchError((_) => of(NULL_ACTIVITY)),
    );
  }

  getBookingsByActivityId$(activityId: number) {
    const url = `${this.#bookingsUrl}?activityId=${activityId}`;
    return this.#http$.get<Booking[]>(url);
  }

  postBooking$(booking: Booking) {
    return this.#http$.post<Booking>(this.#bookingsUrl, booking);
  }

  putActivity$(activity: Activity) {
    const url = `${this.#activitiesUrl}/${activity.id}`;
    return this.#http$.put<Activity>(url, activity);
  }
}
