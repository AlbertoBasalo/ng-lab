import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivitiesService {
  #http$ = inject(HttpClient);
  #apiUrl = 'activities';

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
