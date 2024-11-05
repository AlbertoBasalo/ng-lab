import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BookingDto } from '@models/booking.dto';
import { LaunchDto, LaunchStatus } from '@models/launch.dto';
import { RocketDto } from '@models/rocket.dto';
import { Observable, of } from 'rxjs';

/**
 * Bookings service, used to get and update data from the API
 */
@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  readonly http = inject(HttpClient);
  readonly URL = 'http://localhost:3000/api';
  readonly launchesUrl = `${this.URL}/launches`;
  readonly bookingsUrl = `${this.URL}/bookings`;
  readonly rocketsUrl = `${this.URL}/rockets`;

  /**
   * Update the status of a launch if changed
   */
  updateLaunchStatus(launch: LaunchDto, status: LaunchStatus): Observable<LaunchDto> {
    if (!launch.id || launch.status === status) {
      return of(launch);
    }
    const updatedLaunch = { ...launch, status };
    const url = `${this.launchesUrl}/${launch.id}`;
    return this.http.put<LaunchDto>(url, updatedLaunch);
  }

  /**
   * Create a booking for a launch if the number of seats is valid
   */
  createBooking(launch: LaunchDto, numberOfSeats: number): Observable<BookingDto | undefined> {
    if (numberOfSeats <= 0) {
      return of(undefined);
    }
    const newBooking: BookingDto = {
      id: `bkg_${Math.random() * 100}`,
      travelerId: `usr_t1`,
      launchId: launch.id,
      numberOfSeats,
      totalPrice: launch.pricePerSeat * numberOfSeats,
      status: 'pending',
    };
    return this.http.post<BookingDto>(this.bookingsUrl, newBooking);
  }

  /**
   * Get the bookings for a launch
   */
  getBookings$(launchId: string): Observable<BookingDto[]> {
    const url = `${this.bookingsUrl}?key=launchId&value=${launchId}`;
    return this.http.get<BookingDto[]>(url);
  }

  /**
   * Get a launch by its id
   */
  getLaunch$(launchId: string): Observable<LaunchDto> {
    const url = `${this.launchesUrl}/${launchId}`;
    return this.http.get<LaunchDto>(url);
  }

  /**
   * Get a rocket by its id
   */
  getRocket$(rocketId: string): Observable<RocketDto> {
    const url = `${this.rocketsUrl}/${rocketId}`;
    return this.http.get<RocketDto>(url);
  }
}
