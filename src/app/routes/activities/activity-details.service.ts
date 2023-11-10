import { Injectable } from '@angular/core';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityDetailsService {

  getActivity$(slug: string) {
    return of({
      id: '1',
      name: slug,
      price: 100,
      date: new Date('2024-07-14'),
      maxParticipants: 6,
      minParticipants: 4,
      slug,
    }).pipe(delay(1000));
  }
}
