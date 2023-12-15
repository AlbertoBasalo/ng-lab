import { Injectable, Injector, computed, inject } from '@angular/core';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { AuthStore } from '@shared/services/auth.store';
import { PageStore } from '@shared/services/page.store';
import { ActivitySlugService } from './activity-slug.service';

@Injectable()
export class ActivitySlugPageStore extends PageStore {
  // Injection division
  readonly #service = inject(ActivitySlugService);
  readonly #authStore = inject(AuthStore);
  // State division
  #getActivityState = this.addState<Activity>(NULL_ACTIVITY);
  #getParticipantsState = this.addState<number>(0);

  // Selectors division
  isOwner = computed(() => this.activity().userId === this.#authStore.user().id);
  getActivityStage = computed(() => this.#getActivityState().stage);
  activity = computed(() => this.#getActivityState().result);
  participants = computed(() => this.#getParticipantsState().result);
  availablePlaces = computed(() => this.activity().maxParticipants - this.participants());
  availableText = computed(() => {
    if (this.participants() === 0) {
      return 'Be the first to enroll.';
    }
    if (this.availablePlaces() === 0) {
      return 'Activity sold out. Wait for the next.';
    }
    return `There are ${this.availablePlaces()} available places.`;
  });
  isBookable = computed(
    () => ['published', 'confirmed'].includes(this.activity().status) && this.availablePlaces() > 0,
  );

  constructor(injector: Injector) {
    super(injector);
  }

  // Commands division
  getActivityBySlug(slug: string) {
    this.dispatch(this.#service.getActivityBySlug$(slug), this.#getActivityState);
  }
  getParticipantsByActivityId(activityId: number) {
    this.dispatch(this.#service.getParticipantsByActivityId$(activityId), this.#getParticipantsState);
  }
}
