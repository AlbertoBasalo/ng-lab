import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { slugify } from '@shared/domain/slug.utils';
import { AuthStore } from '@shared/services/auth.store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewActivityService {
  #http$ = inject(HttpClient);
  #authStore = inject(AuthStore);
  #apiUrl = 'activities';

  postActivity$(activity: Partial<Activity>): Observable<Activity> {
    activity.userId = this.#authStore.userId();
    activity.slug = slugify(activity.name);
    return this.#http$.post<Activity>(this.#apiUrl, activity);
  }
}
