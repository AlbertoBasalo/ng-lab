import { Injectable, inject } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  #activities = inject(ActivitiesRepository);

  getActivities$() {
    return this.#activities.getActivities$();
  }
}
