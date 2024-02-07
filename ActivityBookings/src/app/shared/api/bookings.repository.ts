import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '@domain/booking.type';

@Injectable({
  providedIn: 'root',
})
export class BookingsRepository {
  #http = inject(HttpClient);
  #bookingsUrl = 'http://localhost:3000/bookings';

  getBookingsByActivityId$(activityId: number) {
    const url = `${this.#bookingsUrl}?activityId=${activityId}`;
    return this.#http.get<Booking[]>(url);
  }

  postBooking$(booking: Booking) {
    return this.#http.post<Booking>(this.#bookingsUrl, booking);
  }
}
