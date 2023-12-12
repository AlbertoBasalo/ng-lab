import { ChangeDetectionStrategy, Component, Injector, Input, OnInit, computed, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { connect, createSignal } from '@shared/services/command.signal';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { PendingComponent } from '@shared/ui/pending.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent, PendingComponent, ErrorComponent, RouterLink],
  providers: [ActivitySlugService],
  template: `
    <lab-page [title]="title()">
      @if (getActivityStatus() === 'success') {
        <lab-activity-slug [activity]="getActivityResult()" (booking)="onBooking()" />
      }
      <footer>
        <p>to be another computed signal</p>
        @switch (getActivityStatus()) {
          @case ('pending') {
            <lab-pending message="Loading activity {{ slug }}" />
          }
          @case ('error') {
            <lab-error [message]="getActivityError()" />
          }
        }
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
      </footer>
    </lab-page>
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

  #getActivity = createSignal<Activity>(NULL_ACTIVITY);

  #postBooking = createSignal<Booking>(NULL_BOOKING);

  // template signals division

  getActivityStatus = computed(() => this.#getActivity().status);
  getActivityError = computed(() => this.#getActivity().error);
  getActivityResult = computed(() => this.#getActivity().result);
  postBookingStatus = computed(() => this.#postBooking().status);
  postBookingError = computed(() => this.#postBooking().error);
  postBookingResult = computed(() => this.#postBooking().result);
  title = computed(() => {
    if (this.#getActivity().status === 'success') {
      return this.#getActivity().result.name;
    } else {
      return 'Loading...';
    }
  });
  // component life-cycle division

  /** Load the activity on init */
  ngOnInit() {
    // ?: use router params$ instead of ngOnInit
    connect<Activity>(
      this.#service.getActivityBySlug$(this.slug), // the observable
      this.#getActivity, // the signal
      this.#injector, // here we are not in an injection context
    );
  }

  // template event handlers division

  /** Post a new booking */
  onBooking() {
    const activity = this.#getActivity().result;
    connect(
      this.#service.postBookActivity$(activity), // the observable
      this.#postBooking, // the signal
      this.#injector, // here we are not in an injection context
    );
  }
}
