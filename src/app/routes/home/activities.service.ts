import { Injectable } from '@angular/core';
import { Observable, delay, of, tap } from 'rxjs';
import { Activity } from '../../shared/activity.type';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  /**
   * Get the full list of activities
   * @returns An observable with a list of activities
   * @throws An error randomly
   */
  getActivities$(): Observable<Activity[]> {
    return of([
      { id: '1', name: 'Hiking' },
      { id: '2', name: 'Biking' },
      { id: '3', name: 'Swimming' },
    ])
      .pipe(
        delay(2000),
        tap(() => {
          if (Math.random() > 0.99) throw new Error('Randomly generated');
        }));
  }
}
