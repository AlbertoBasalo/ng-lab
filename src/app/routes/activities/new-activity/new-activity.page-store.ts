import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { PageStore } from '@shared/services/page.store';
import { NewActivityService } from './new-activity.service';

@Injectable()
export class NewActivityPageStore extends PageStore {
  // Injection division
  readonly #service = inject(NewActivityService);

  // State division
  #postActivityStatus = this.addNewStatus<Activity>(NULL_ACTIVITY);

  // Selectors division
  postActivityStatus = computed(() => this.#postActivityStatus().status);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Create a new activity');
  }

  // Commands division
  postActivity$(activity: Partial<Activity>) {
    return this.connectSourceToStatus(this.#service.postActivity$(activity), this.#postActivityStatus);
  }
}
