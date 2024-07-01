import { Injectable, inject } from '@angular/core';
import { Activity } from '@domain/activity.type';
import { ActivitiesRepository } from '@services/api/activities.repository';
import { AuthStore } from '@services/state/auth.store';
import { Observable } from 'rxjs';

/**
 * Service to help the ActivityPage to post activities.
 * - Uses the ActivitiesRepository to post the activity.
 * - Uses the AuthStore to get the current user id.
 */
@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  // * Injected services division

  /** The repository to post the activity */
  #activitiesRepository = inject(ActivitiesRepository);
  /** The store to get the current user id */
  #authStore = inject(AuthStore);

  // * Public methods division

  /**
   * Posts a new activity to the API, filling the userId and slug
   * @param newActivity The activity to post
   * @returns An observable with the posted activity
   */
  postActivity$(newActivity: Activity): Observable<Activity> {
    newActivity.userId = this.#authStore.userId();
    newActivity.slug = (newActivity.name + '-' + newActivity.location).toLowerCase().replace(/ /g, '_');
    return this.#activitiesRepository.postActivity$(newActivity);
  }
}
