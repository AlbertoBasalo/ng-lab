import { Injectable, inject } from '@angular/core';
import { Activity, ActivityStatus, NULL_ACTIVITY } from '@domain/activity.type';
import { Booking } from '@domain/booking.type';
import { Observable, of, tap } from 'rxjs';
import { ActivitiesRepository } from 'src/app/shared/api/activities.repository';
import { BookingsRepository } from 'src/app/shared/api/bookings.repository';

/**
 * Facade service for the Bookings page
 */
@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  // * Injected services division

  #activitiesRepository = inject(ActivitiesRepository);
  #bookingsRepository = inject(BookingsRepository);

  // * Public methods division

  /**
   * Get an activity by its slug or return NULL_ACTIVITY if the slug is not defined
   * @param slug The slug of the activity
   * @returns An observable with the activity
   */
  getActivityBySlug$(slug: string | undefined): Observable<Activity> {
    if (!slug) return of(NULL_ACTIVITY);
    return this.#activitiesRepository.getActivityBySlug$(slug);
  }

  /**
   * Get the bookings of an activity or an empty array if the activity id is not defined
   * @param activityId The id of the activity
   * @returns An observable with the bookings array
   */
  getBookingsByActivityId$(activityId: number): Observable<Booking[]> {
    if (!activityId) return of([]);
    return this.#bookingsRepository.getBookingsByActivityId$(activityId);
  }

  /**
   * Post a booking to the API
   * @param booking The booking to be posted
   * @returns An observable with the booking
   */
  postBooking$(booking: Booking): Observable<Booking> {
    return this.#bookingsRepository.postBooking$(booking);
  }

  /**
   * Update the status of an activity if it is different from the current status
   * @param activity The activity to be updated
   * @param status The new status
   * @returns An observable with the updated activity
   */
  updateActivityStatus$(activity: Activity, status: ActivityStatus): Observable<Activity> {
    if (activity.status === status) return of(activity);
    return this.#activitiesRepository
      .putActivity$({ ...activity, status })
      .pipe(tap(() => console.log('activity status updated')));
  }
}
