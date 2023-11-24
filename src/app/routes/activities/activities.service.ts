import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/activity.type';
import { Observable } from 'rxjs';

export class ActivitiesService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';

  /**
   * Get the list of activities filtered by a query
   * @param query The query to filter the activities
   * @returns An observable with a list of activities
   */
  getActivitiesByFilter$(query: string): Observable<Activity[]> {
    const url = `${this.#apiUrl}?q=${query}`;
    return this.#http$.get<Activity[]>(url);
  }
}
