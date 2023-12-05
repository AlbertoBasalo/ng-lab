import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { ActivityBooking } from './activity-booking.type';

export class BookingsService {
  #http$ = inject(HttpClient);
  #authStore$ = inject(AuthStore);
  #apiBookingsUrl = 'bookings';
  #apiActivitiesUrl = 'activities';

  /**
   * Get all bookings for the current user and merge them with the activity
   * @returns Observable of ActivityBooking[]
   */
  getBookings$(): Observable<ActivityBooking[]> {
    const bookingsUrl = `${
      this.#apiBookingsUrl
    }?userId=${this.#authStore$.userId()}`;
    return this.#http$
      .get<Booking[]>(bookingsUrl)
      .pipe(switchMap((bookings) => this.#fillBookings(bookings)));
  }

  #fillBookings(bookings: Booking[]): Observable<ActivityBooking[]> {
    if (bookings.length === 0) return of([]);
    return forkJoin(
      bookings.map((booking) => this.#getBookingWithActivity$(booking)),
    );
  }

  #getBookingWithActivity$(booking: Booking): Observable<ActivityBooking> {
    return this.#http$
      .get<Activity>(`${this.#apiActivitiesUrl}/${booking.activityId}`)
      .pipe(map((activity) => ({ ...booking, activity })));
  }

  /**
   * Removes a booking
   * @param id Booking id
   */
  cancelBooking$(id: number): Observable<unknown> {
    return this.#http$.delete<unknown>(`${this.#apiBookingsUrl}/${id}`);
  }
}
