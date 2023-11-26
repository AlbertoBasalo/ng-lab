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

import { Activity, NULL_ACTIVITY } from '@shared/activity.type';
import { Booking, NULL_BOOKING } from '@shared/booking.type';
import { ErrorComponent } from '@shared/error.component';
import { PendingComponent } from '@shared/pending.component';
import { State, toState } from '@shared/state.signal';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActivitySlugComponent, PendingComponent, ErrorComponent],
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
        @if (postState().status == 'success') {
          <p>Booking successful!</p>
        } @else if (postState().error) {
          <lab-error [message]="postState().error" />
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

  // ToDo: improve to act as a component store (multi-command)
  // ? : ngrx/signals
  // https://dev.to/ngrx/announcing-ngrx-v17-introducing-ngrx-signals-operators-performance-improvements-workshops-and-more-55e4
  getState!: Signal<State<Activity>>;
  postState: Signal<State<Booking>> = signal({
    status: 'idle',
    value: NULL_BOOKING,
  });

  constructor(private readonly injector: Injector) {
    // We need our current injector to be able pass it to the `toState` function
  }
  errorMessage = computed(() => `Failed to load ${this.getState().error}`);

  onBooking() {
    const activity = this.getState().value;
    if (activity)
      this.postState = toState(
        this.#service.postBookActivity$(activity),
        NULL_BOOKING,
        this.injector,
      );
  }
}
