import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/activity.type';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivitySlugService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';

  /**
   * Gets an activity by its slug
   * @param slug the slug of the activity to retrieve
   * @returns An observable activity with the given slug
   * @throws Error if the activity is not found
   */
  getActivityBySlug$(slug: string): Observable<Activity> {
    const url = `${this.#apiUrl}?slug=${slug}`;
    return this.#http$.get<Activity[]>(url).pipe(
      tap((activities) => {
        if (activities.length == 0)
          throw new Error(`Activity not found: ${slug}`);
      }),
      map((activities) => activities[0]),
    );
  }
}
