import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@domain/activity.type';
import { Filter } from '@domain/filter.type';
import { Observable, catchError, map, of, throwError } from 'rxjs';

/**
 * Repository service for accessing the activities data from the API
 */
@Injectable({
  providedIn: 'root',
})
export class ActivitiesRepository {
  // * Private properties division

  /** The API URL for the activities
   * @todo Replace with an environment injected variable
   */
  #apiUrl = 'http://localhost:3000/activities';

  // * Injected services division

  /** The HTTP client to make requests to the API */
  #http = inject(HttpClient);

  // * Public methods division

  /**
   * Get all activities from the API
   * @returns An observable with the activities
   */
  getActivities$(): Observable<Activity[]> {
    return this.#http.get<Activity[]>(this.#apiUrl);
  }

  /**
   * Get an activity by its slug from the API
   * @param slug The slug of the activity to get
   * @returns An observable with the activity or NULL_ACTIVITY if not found
   */
  getActivityBySlug$(slug: string | undefined): Observable<Activity> {
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

  /**
   * Get all activities from the API based on a filter
   * @param filter The filter to be applied
   * @returns An observable with the activities
   */
  getActivitiesByFilter$(filter: Filter): Observable<Activity[]> {
    const url = `${this.#apiUrl}?q=${filter.search}&_sort=${filter.orderBy}&_order=${filter.sort}`;
    return this.#http.get<Activity[]>(url);
  }

  /**
   * Updates an activity in the API
   * @param activity The activity to be updated
   * @returns An observable with the updated activity
   */
  putActivity$(activity: Activity): Observable<Activity> {
    const url = `${this.#apiUrl}/${activity.id}`;
    return this.#http.put<Activity>(url, activity).pipe(
      catchError((error) => {
        console.error('Error updating activity', error);
        return throwError(() => new Error(error));
      }),
    );
  }
}
