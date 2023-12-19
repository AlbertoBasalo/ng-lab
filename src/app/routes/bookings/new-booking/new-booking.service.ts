import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '@shared/domain/booking.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewBookingService {
  #http$ = inject(HttpClient);

  #apiBookingsUrl = 'bookings';

  /**
   * Posts a booking for the given activity
   * @param booking the booking to post
   * @returns An observable with the response booking
   */
  postBooking$(booking: Partial<Booking>): Observable<Booking> {
    const url = `${this.#apiBookingsUrl}`;
    return this.#http$.post<Booking>(url, booking);
  }
}
