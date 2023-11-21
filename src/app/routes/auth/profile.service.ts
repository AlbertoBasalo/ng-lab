import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/activity.type';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/';

  getActivities$(userId: string) {
    const url = `${this.#apiUrl}activities?userId=${userId}`;
    return this.#http$.get<Activity[]>(url);
  }
}