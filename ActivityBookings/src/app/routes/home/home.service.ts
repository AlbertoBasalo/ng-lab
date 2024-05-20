import { Injectable, inject } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { DEFAULT_FILTER, Filter } from '@domain/filter.type';
import { Observable } from 'rxjs';

/**
 * Facade service for the Home page
 */
@Injectable({
  providedIn: 'root',
})
export class HomeService {
  // * Injected services division

  /** The repository used to get activities data from the API*/
  #activitiesRepository: ActivitiesRepository = inject(ActivitiesRepository);

  // * Public methods division

  /**
   * Get all activities from the API
   * @returns An observable with the activities
   */
  getActivities$(): Observable<Activity[]> {
    return this.#activitiesRepository.getActivities$();
  }

  /**
   * Get all activities from the API based on a filter
   * @param partialFilter The partial filter to be applied
   * @returns An observable with the activities
   */
  getActivitiesByFilter$(partialFilter: Partial<Filter>): Observable<Activity[]> {
    const filter: Filter = {
      search: partialFilter.search || DEFAULT_FILTER.search,
      sortBy: partialFilter.sortBy || DEFAULT_FILTER.sortBy,
      order: partialFilter.order || DEFAULT_FILTER.order,
    };
    return this.#activitiesRepository.getActivitiesByFilter$(filter);
  }
}
