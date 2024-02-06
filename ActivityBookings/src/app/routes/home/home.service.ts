import { Injectable, inject } from '@angular/core';
import { ActivitiesService } from '@api/activities.service';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  #activities = inject(ActivitiesService);

  getActivities() {
    return this.#activities.getActivities();
  }
}
