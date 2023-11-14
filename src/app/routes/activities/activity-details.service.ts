import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Activity } from '../../shared/activity.type';

@Injectable({
  providedIn: 'root',
})
export class ActivityDetailsService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';
  getActivityBySlug$(slug: string): Observable<Activity> {
    console.log('getActivityBySlug$', slug);
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
