import { Injectable } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { Filter } from '@domain/filter.type';
import { Observable } from 'rxjs';

/**
 * Facade service for the Home page
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // * Injected services division

  constructor(private activitiesRepository: ActivitiesRepository) {
    console.log('HomeService created');
    console.log('ActivitiesRepository', activitiesRepository);
  }

  // * Public methods division

  /**
   * Get all activities from the API
   * @returns An observable with the activities
   */
  getActivities$(): Observable<Activity[]> {
    return this.activitiesRepository?.getActivities$();
  }

  /**
   * Get all activities from the API
   * @returns An observable with the activities
   */
  getActivitiesByFilter$(filter: Filter): Observable<Activity[]> {
    return this.activitiesRepository.getActivitiesByFilter$(filter);
  }
}
