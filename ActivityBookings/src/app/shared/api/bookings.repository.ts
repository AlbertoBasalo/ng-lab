import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '@domain/booking.type';

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
   * @returns An observable with the bookings
   */
  getBookingsByActivityId$(activityId: number) {
    const url = `${this.#bookingsUrl}?activityId=${activityId}`;
    return this.#http.get<Booking[]>(url);
  }

  /**
   * Create a new booking in the API
   * @param booking The booking to create
   * @returns An observable with the created booking
   */
  postBooking$(booking: Booking) {
    return this.#http.post<Booking>(this.#bookingsUrl, booking);
  }
}
