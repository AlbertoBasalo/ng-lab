import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Activity } from '@shared/domain/activity.type';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewActivityService {
  #http$ = inject(HttpClient);
  #apiUrl = 'activities';

  postActivity$(activity: Partial<Activity>): Observable<Activity> {
    return this.#http$.post<Activity>(this.#apiUrl, activity);
  }
}
