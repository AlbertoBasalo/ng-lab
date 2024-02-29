import { Injectable, inject } from '@angular/core';
import { Activity } from '@domain/activity.type';
import { Observable } from 'rxjs';
import { ActivitiesRepository } from 'src/app/shared/api/activities.repository';

/**
 * Facade service for the Home page
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // * Injected services division

  #activitiesRepository = inject(ActivitiesRepository);

  // * Public methods division

  /**
   * Get all activities from the API
   * @returns An observable with the activities
   */
  getActivities$(): Observable<Activity[]> {
    return this.#activitiesRepository.getActivities$();
  }
}
