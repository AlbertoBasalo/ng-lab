import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
import { catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesRepository {
  #http = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';

  getActivities$() {
    return this.#http.get<Activity[]>(this.#apiUrl);
  }

  getActivityBySlug$(slug: string | undefined) {
    if (!slug) return of(NULL_ACTIVITY);
    const url = `${this.#apiUrl}?slug=${slug}`;
    return this.#http.get<Activity[]>(url).pipe(
      map((activities) => activities[0] || NULL_ACTIVITY),
      catchError((error) => {
        console.error('Error getting activity', error);
        return of(NULL_ACTIVITY);
      }),
    );
  }

  putActivity$(activity: Activity) {
    const url = `${this.#apiUrl}/${activity.id}`;
    return this.#http.put<Activity>(url, activity).pipe(
      catchError((error) => {
        console.error('Error updating activity', error);
        return throwError(() => new Error(error));
      }),
    );
  }
}
