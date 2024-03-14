import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '@domain/booking.type';
import { Observable } from 'rxjs';

/**
 * Repository service for accessing the bookings data from the API
 */
@Injectable({
  providedIn: 'root',
})
export class BookingsRepository {
  // * Private properties division

  #bookingsUrl = 'http://localhost:3000/bookings';

  // * Injected services division

  #http = inject(HttpClient);

  // * Public methods division

  /**
   * Get all bookings from the API
   * @param activityId The id of the activity to get the bookings from
   * @returns An observable with the bookings of an activity
   */
  getBookingsByActivityId$(activityId: number): Observable<Booking[]> {
    const url = `${this.#bookingsUrl}?activityId=${activityId}`;
    return this.#http.get<Booking[]>(url);
  }

  /**
   * Create a new booking in the API
   * @param booking The booking to create
   * @returns An observable with the created booking
   */
  postBooking$(booking: Booking): Observable<Booking> {
    return this.#http.post<Booking>(this.#bookingsUrl, booking);
  }
}
