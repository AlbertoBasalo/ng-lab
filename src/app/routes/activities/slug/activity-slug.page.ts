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
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { State, toState } from '@shared/services/state.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PendingComponent } from '@shared/ui/pending.component';
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
    console.log('ActivitySlugPage.slug', slug);
    // With this paradigm, we are not leveraging the observable router
    // Every time the slug changes, we need to reset the state
    this.getState = toState<Activity>(
      this.#service.getActivityBySlug$(slug), // the observable
      NULL_ACTIVITY, // the initial value
      this.injector, // here we are not in an injection context
    );
  }

  // two state signals, one for the activity, one for the booking
  getState!: Signal<State<Activity>>;
  postState: Signal<State<Booking>> = signal({
    status: 'idle',
    value: NULL_BOOKING,
  });

  constructor(private readonly injector: Injector) {
    // We need our current injector to be able pass it to the `toState` function
    console.log('ActivitySlugPage created');
  }

  /** A computed signal getting the last error, either from get or post states */
  errorMessage = computed(() => {
    const getError = this.getState().error;
    if (getError) return `Failed loading: ${getError}`;
    const postError = this.postState().error;
    if (postError) return `Failed booking ${postError}`;
    return '';
  });

  /** Calls a service that pos a new booking and wires its observable to a signal */
  onBooking() {
    const activity = this.getState().value;
    this.postState = toState(
      this.#service.postBookActivity$(activity), // the observable
      NULL_BOOKING, // the initial value
      this.injector, // here we are not in an injection context
    );
  }
}
