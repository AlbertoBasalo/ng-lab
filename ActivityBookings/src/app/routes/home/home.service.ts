import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '../../shared/domain/activity.type';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/activities';

  getActivities$() {
    return this.#http$.get<Activity[]>(this.#apiUrl);
  }
}
