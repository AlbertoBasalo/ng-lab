import { Injectable, inject } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';
import { BookingsRepository } from '@api/bookings.repository';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  activities = inject(ActivitiesRepository);
  bookings = inject(BookingsRepository);

  getActivityBySlug$(slug: string | undefined): Observable<Activity> {
    if (!slug) return of(NULL_ACTIVITY);
    return this.activities.getActivityBySlug$(slug);
  }

  getBookingsByActivityId$(activityId: number): Observable<Booking[]> {
    if (!activityId) return of([]);
    return this.bookings.getBookingsByActivityId$(activityId);
  }

  postBooking$(booking: Booking): Observable<Booking> {
    return this.bookings.postBooking$(booking);
  }

  updateActivityStatus$(activity: Activity, status: ActivityStatus): Observable<Activity> {
    if (activity.status === status) return of(activity);
    return this.activities
      .putActivity$({ ...activity, status })
      .pipe(tap(() => console.log('activity status updated')));
  }
}
