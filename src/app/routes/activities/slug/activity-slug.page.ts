import { ChangeDetectionStrategy, Component, Injector, Input, OnInit, computed, effect, inject } from '@angular/core';

import { Router, RouterLink } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { Booking, NULL_BOOKING } from '@shared/domain/booking.type';
import { connectToCommandSignal } from '@shared/services/command.signal';
import { PageStore } from '@shared/services/page.store';
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
    <lab-page [store]="store">
      @if (getActivityStatus() === 'success') {
        <lab-activity-slug [activity]="getActivityResult()" (booking)="onBooking()" />
      }
    </lab-page>
  `,
})
export default class ActivitySlugPage implements OnInit {
  // I/O division
  // ?: use router params$ instead of @Input
  /** The activity slug received from a router param */
  @Input({ required: true }) slug!: string;

  // Injection division
  #injector = inject(Injector);
  #router = inject(Router);
  #service = inject(ActivitySlugService);
  store = inject(PageStore);

  // Data division
  #getActivity = this.store.addNewStatusSignal<Activity>(NULL_ACTIVITY);
  getActivityStatus = computed(() => this.#getActivity().status);
  getActivityResult = computed(() => this.#getActivity().result);
  #postBooking = this.store.addNewStatusSignal<Booking>(NULL_BOOKING);

  // Life-cycle division
  constructor() {
    effect(() => this.#navigateAfterCreate());
    effect(() => this.#setPageTitle(), { allowSignalWrites: true });
  }

  ngOnInit() {
    // ?: use router params$ instead of ngOnInit
    connectToCommandSignal<Activity>(this.#service.getActivityBySlug$(this.slug), this.#getActivity, this.#injector);
  }

  // Event handlers division
  onBooking() {
    const activity = this.#getActivity().result;
    connectToCommandSignal(this.#service.postBookActivity$(activity), this.#postBooking, this.#injector);
  }

  // Effect handlers
  #navigateAfterCreate() {
    if (this.#postBooking().status === 'success') {
      this.#router.navigate(['/', 'bookings']);
    }
  }
  #setPageTitle() {
    if (this.#getActivity().status === 'success') {
      this.store.setTitle(this.#getActivity().result.name);
    } else {
      this.store.setTitle('Loading...');
    }
  }
}
