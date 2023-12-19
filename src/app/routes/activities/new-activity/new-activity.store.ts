import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { NewActivityService } from './new-activity.service';

@Injectable()
export class NewActivityStore {
  // Injection division
  readonly #service = inject(NewActivityService);
  readonly #injector = inject(Injector);
  // State division
  #postActivityState = createCommandState<Activity>(NULL_ACTIVITY);

  // Selectors division
  postActivityStage = computed(() => this.#postActivityState().stage);
  postActivityError = computed(() => this.#postActivityState().error);
  postActivityResult = computed(() => this.#postActivityState().result);

  // Commands division
  postActivity(activity: Partial<Activity>) {
    connectCommandState(this.#service.postActivity$(activity), this.#postActivityState, this.#injector);
  }
}
