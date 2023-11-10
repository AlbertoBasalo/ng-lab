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
    return of(
      [
        {
          id: '1',
          name: 'Sailing',
          price: 100,
          date: new Date('2024-07-14'),
          maxParticipants: 6,
          minParticipants: 4,
        },
        {
          id: '2',
          name: 'Surfing',
          price: 50,
          date: new Date('2024-08-05'),
          maxParticipants: 10,
          minParticipants: 5,
        },
        {
          id: '3',
          name: 'Kayaking',
          price: 70,
          date: new Date('2024-08-16'),
          maxParticipants: 8,
          minParticipants: 4,
        },
        {
          id: '4',
          name: 'Hiking',
          price: 30,
          date: new Date('2024-08-23'),
          maxParticipants: 20,
          minParticipants: 10,
        },
        {
          id: '5',
          name: 'Climbing',
          price: 80,
          date: new Date('2024-09-03'),
          maxParticipants: 4,
          minParticipants: 2,
        },
      ].map((activity) => ({
        ...activity,
        slug: activity.name.toLowerCase().replace(/ /g, '-'),
      }))
    ).pipe(
      delay(1000),
      tap(() => {
        if (Math.random() > 0.99) throw new Error('Randomly generated');
      })
    );
  }
}
