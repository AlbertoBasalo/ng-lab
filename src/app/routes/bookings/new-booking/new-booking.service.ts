import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Booking } from '@shared/domain/booking.type';
import { AuthStore } from '@shared/services/auth.store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewBookingService {
  #http$ = inject(HttpClient);
  #authStore = inject(AuthStore);
  #apiBookingsUrl = 'bookings';

  /**
   * Posts a booking for the given activity
   * @param booking the booking to post
   * @returns An observable with the response booking
   */
  postBooking$(booking: Partial<Booking>): Observable<Booking> {
    const url = `${this.#apiBookingsUrl}`;
    booking.userId = this.#authStore.userId();
    booking.date = new Date();
    return this.#http$.post<Booking>(url, booking);
  }
}
