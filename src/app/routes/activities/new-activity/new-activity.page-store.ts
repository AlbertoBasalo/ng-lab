import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { connectCommandToSignal, createCommandSignal } from '@shared/services/command.state';
import { NewActivityService } from './new-activity.service';

@Injectable()
export class NewActivityPageStore {
  // Injection division
  readonly #service = inject(NewActivityService);
  readonly #injector = inject(Injector);
  // State division
  #postActivityState = createCommandSignal<Activity>(NULL_ACTIVITY);

  // Selectors division
  postActivityStage = computed(() => this.#postActivityState().stage);

  // Commands division
  postActivity(activity: Partial<Activity>) {
    connectCommandToSignal(this.#service.postActivity$(activity), this.#postActivityState, this.#injector);
  }
}
