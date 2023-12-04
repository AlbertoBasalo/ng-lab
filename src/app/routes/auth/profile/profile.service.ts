import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Booking } from '@shared/domain/booking.type';

export class ProfileService {
  #http$ = inject(HttpClient);
  #apiActivitiesUrl = 'activities';
  #apiBookingsUrl = 'bookings';

  getActivities$(userId: number) {
    const url = `${this.#apiActivitiesUrl}?userId=${userId}`;
    return this.#http$.get<Activity[]>(url);
  }

  getBookings$(userId: number) {
    const url = `${this.#apiBookingsUrl}?userId=${userId}`;
    return this.#http$.get<Booking[]>(url);
  }
}
