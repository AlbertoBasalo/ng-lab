import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { PageStore } from '@shared/services/page.store';
import { NewActivityService } from './new-activity.service';

@Injectable()
export class NewActivityPageStore extends PageStore {
  // Injection division
  readonly #service = inject(NewActivityService);

  // State division
  #postActivityState = this.addNewState<Activity>(NULL_ACTIVITY);

  // Selectors division
  postActivityStage = computed(() => this.#postActivityState().stage);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Create a new activity');
  }

  // Commands division
  postActivity$(activity: Partial<Activity>) {
    return this.connectCommandToState(this.#service.postActivity$(activity), this.#postActivityState);
  }
}
