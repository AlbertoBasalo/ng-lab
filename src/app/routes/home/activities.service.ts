import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Activity } from '../../shared/activity.type';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';
  /**
   * Get the list of activities filtered by a query
   * @param query The query to filter the activities
   * @returns An observable with a list of activities
   * @throws An error randomly
   */
  getActivitiesByFilter$(query: string): Observable<Activity[]> {
    console.log('getActivitiesByFilter$', query);
    const url = `${this.#apiUrl}?q=${query}`;
    return this.#http$.get<Activity[]>(url);
  }
}
