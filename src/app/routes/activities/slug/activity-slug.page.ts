import { ChangeDetectionStrategy, Component, Injector, Input, OnInit, computed, effect, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { connect, createSignal } from '@shared/services/command.signal';
import { PageTemplate } from '@shared/ui/page.template';
import { StatusComponent } from '@shared/ui/status.component';
import { ActivitySlugComponent } from './activity-slug.component';
import { ActivitySlugService } from './activity-slug.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, ActivitySlugComponent, StatusComponent, RouterLink],
  providers: [ActivitySlugService],
  template: `
    <lab-page [title]="title()" [commandStatus]="getActivityStatus()">
      @if (getActivityStatus().status === 'success') {
        <lab-activity-slug [activity]="getActivityResult()" (booking)="onBooking()" />
      }
      <footer>
        <lab-status [commandStatus]="postBookingStatus()" />
      </footer>
    </lab-page>
  `,
})
export default class ActivitySlugPage implements OnInit {
  // injection division

  #service = inject(ActivitySlugService);
  #router = inject(Router);
  #injector = inject(Injector);

  // component inputs division

  // ?: use router params$ instead of @Input
  /** The activity slug received from a router param */
  @Input({ required: true }) slug!: string;

  // component signals division

  #getActivity = createSignal<Activity>(NULL_ACTIVITY);

  #postBooking = createSignal<Booking>(NULL_BOOKING);

  // template signals division

  getActivityStatus = computed(() => this.#getActivity());

  getActivityResult = computed(() => this.#getActivity().result);
  postBookingStatus = computed(() => this.#postBooking());
  postBookingResult = computed(() => this.#postBooking().result);
  title = computed(() => {
    if (this.#getActivity().status === 'success') {
      return this.#getActivity().result.name;
    } else {
      return 'Loading...';
    }
  });

  // component life-cycle division

  constructor() {
    effect(() => {
      if (this.#postBooking().status === 'success') {
        this.#router.navigate(['/', 'bookings']);
      }
    });
  }

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
