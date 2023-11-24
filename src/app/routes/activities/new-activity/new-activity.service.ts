import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Activity } from '@shared/activity.type';
import { AuthStore } from '@shared/auth.store';
import { Observable } from 'rxjs';

export class NewActivityService {
  #http$ = inject(HttpClient);
  #authStore = inject(AuthStore);
  #apiUrl = 'http://localhost:3000/activities';

  postActivity$(activity: Partial<Activity>): Observable<Activity> {
    activity.userId = this.#authStore.user().id;
    activity.slug = activity.name?.toLowerCase().replace(/\s/g, '-');
    return this.#http$.post<Activity>(this.#apiUrl, activity);
  }
}
