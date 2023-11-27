import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  Signal,
  computed,
  inject,
  signal,
} from '@angular/core';

import { JsonPipe } from '@angular/common';
import { Activity, NULL_ACTIVITY } from '@shared/activity.type';
import { Booking, NULL_BOOKING } from '@shared/booking.type';
import { ErrorComponent } from '@shared/state/error.component';
import { PendingComponent } from '@shared/state/pending.component';
import { State, toState } from '@shared/state/state.signal';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivitySlugComponent, PendingComponent, ErrorComponent, JsonPipe],
  providers: [ActivitySlugService],
  template: `
    @switch (getState().status) {
      @case ('pending') {
        <lab-pending message="Loading activity {{ slug }}" />
      }
      @case ('error') {
        <lab-error [message]="errorMessage()" />
      }
      @default {
        <lab-activity-slug
          [activity]="getState().value"
          (booking)="onBooking()"
        />
        @switch (postState().status) {
          @case ('pending') {
            <lab-pending message="Posting booking {{ slug }}" />
          }
          @case ('error') {
            <lab-error [message]="errorMessage()" />
          }
          @case ('success') {
            <h3>Booking successfully done</h3>
            <pre>{{ postState() | json }}</pre>
          }
        }
      }
    }
  `,
})
export default class ActivitySlugPage {
  #service = inject(ActivitySlugService);

  // ?: use router params$ instead of @Input

  /** The activity slug received from a router param */
  @Input({ required: true })
  set slug(slug: string) {
    // With this paradigm, we are not leveraging the observable router
    // Every time the slug changes, we need to reset the state
    this.getState = toState<Activity>(
      this.#service.getActivityBySlug$(slug), // the observable
      NULL_ACTIVITY, // the initial value
      this.injector, // here we are not in an injection context
    );
  }

  getState!: Signal<State<Activity>>;
  postState: Signal<State<Booking>> = signal({
    status: 'idle',
    value: NULL_BOOKING,
  });

  constructor(private readonly injector: Injector) {
    // We need our current injector to be able pass it to the `toState` function
  }
  errorMessage = computed(() => {
    const getError = this.getState().error;
    if (getError) return `Failed loading: ${getError}`;
    const postError = this.postState().error;
    if (postError) return `Failed booking ${postError}`;
    return '';
  });

  onBooking() {
    const activity = this.getState().value;
    this.postState = toState(
      this.#service.postBookActivity$(activity),
      NULL_BOOKING,
      this.injector,
    );
  }
}
