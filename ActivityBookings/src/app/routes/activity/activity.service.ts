import { Injectable, inject } from '@angular/core';
import { ActivitiesRepository } from '@api/activities.repository';
import { Activity } from '@domain/activity.type';
import { AuthStore } from '@state/auth.store';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  #activitiesRepository = inject(ActivitiesRepository);
  #authStore = inject(AuthStore);

  postActivity$(newActivity: Activity) {
    newActivity.userId = this.#authStore.userId();
    newActivity.slug = (newActivity.name + '-' + newActivity.location).toLowerCase().replace(/ /g, '_');
    return this.#activitiesRepository.postActivity$(newActivity);
  }
}
