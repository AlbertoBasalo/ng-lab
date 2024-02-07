import { Injectable, inject } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';
import { BookingsRepository } from '@api/bookings.repository';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  activities = inject(ActivitiesRepository);
  bookings = inject(BookingsRepository);

  getActivityBySlug$(slug: string | undefined) {
    if (!slug) return of(NULL_ACTIVITY);
    return this.activities.getActivityBySlug$(slug);
  }

  getBookingsByActivityId$(activityId: number) {
    if (!activityId) return of([]);
    return this.bookings.getBookingsByActivityId$(activityId);
  }

  postBooking$(booking: Booking) {
    return this.bookings.postBooking$(booking);
  }

  updateActivityStatus$(activity: Activity, status: ActivityStatus | undefined) {
    if (!status) return of(activity);
    if (activity.status === status) return of(activity);
    return this.activities.putActivity$({ ...activity, status });
  }
}
