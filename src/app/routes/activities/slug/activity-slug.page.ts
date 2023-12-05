import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  Input,
  OnInit,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { State, connect } from '@shared/services/state.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PendingComponent } from '@shared/ui/pending.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ActivitySlugComponent,
    PendingComponent,
    ErrorComponent,
    RouterLink,
  ],
  providers: [ActivitySlugService],
  template: `
    @switch (getActivityStatus()) {
      @case ('pending') {
        <lab-pending message="Loading activity {{ slug }}" />
      }
      @case ('error') {
        <lab-error [message]="getActivityError()" />
      }
      @default {
        <lab-activity-slug [activity]="getActivity()" (booking)="onBooking()" />
        @switch (postBookingStatus()) {
          @case ('pending') {
            <lab-pending message="Posting booking {{ slug }}" />
          }
          @case ('error') {
            <lab-error [message]="postBookingError()" />
          }
          @case ('success') {
            <h4>
              Booking successfully done.
              <a [routerLink]="['/', 'bookings']">Go to bookings</a>
            </h4>
          }
        }
      }
    }
  `,
})
export default class ActivitySlugPage implements OnInit {
  // injection division
  #service = inject(ActivitySlugService);
  #injector = inject(Injector);

  // component inputs division
  // ?: use router params$ instead of @Input
  /** The activity slug received from a router param */
  @Input({ required: true }) slug!: string;

  // component signals division
  #getActivityState: WritableSignal<State<Activity>> = signal({
    status: 'idle',
    value: NULL_ACTIVITY,
  });
  #postBookingState: WritableSignal<State<Booking>> = signal({
    status: 'idle',
    value: NULL_BOOKING,
  });

  // template signals division

  /** Current state of the activity */
  getActivityStatus = computed(() => this.#getActivityState().status);
  postBookingStatus = computed(() => this.#postBookingState().status);
  getActivityError = computed(() => this.#getActivityState().error);
  postBookingError = computed(() => this.#postBookingState().error);
  getActivity = computed(() => this.#getActivityState().value);
  postBooking = computed(() => this.#postBookingState().value);

  // component life-cycle division

  /** Load the activity on init */
  ngOnInit() {
    // ?: use router params$ instead of ngOnInit
    connect<Activity>(
      this.#service.getActivityBySlug$(this.slug), // the observable
      this.#getActivityState, // the signal
      this.#injector, // here we are not in an injection context
    );
  }

  // template event handlers division

  /** Post a new booking */
  onBooking() {
    const activity = this.#getActivityState().value;
    connect(
      this.#service.postBookActivity$(activity), // the observable
      this.#postBookingState, // the signal
      this.#injector, // here we are not in an injection context
    );
  }
}
