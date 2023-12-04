import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { ActivityBooking } from './activity-booking.type';

export class BookingsService {
  #http$ = inject(HttpClient);
  #authStore$ = inject(AuthStore);
  #apiBookingsUrl = 'bookings';
  #apiActivitiesUrl = 'activities';
  getBookings$(): Observable<ActivityBooking[]> {
    const bookingsUrl = `${
      this.#apiBookingsUrl
    }?userId=${this.#authStore$.userId()}`;
    // get my bookings
    return this.#http$.get<Booking[]>(bookingsUrl).pipe(
      switchMap((bookings) =>
        forkJoin(
          // for each booking,
          bookings.map((booking) =>
            // get the activity
            this.#http$
              .get<Activity>(`${this.#apiActivitiesUrl}/${booking.activityId}`)
              .pipe(
                // and merge it with the booking
                map((activity) => ({
                  ...booking,
                  activity,
                })),
              ),
          ),
        ),
      ),
    );
  }
}
