import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/activity.type';

export class ProfileService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/';

  getActivities$(userId: number) {
    const url = `${this.#apiUrl}activities?userId=${userId}`;
    return this.#http$.get<Activity[]>(url);
  }
}
