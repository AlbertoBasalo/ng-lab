import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Booking } from '@shared/domain/booking.type';
import { PageTemplate } from '@shared/ui/page.template';
import { NewBookingForm, NewBookingFormValue } from './new-booking.form';
import { NewBookingPageStore } from './new-booking.page-store';

@Component({
  standalone: true,
  imports: [PageTemplate, NewBookingForm],
  providers: [NewBookingPageStore],
  template: `
    <lab-page [store]="store">
      <lab-new-booking [availablePlaces]="availablePlaces" (create)="onCreate($event)" />
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewBookingPage {
  // Injection division
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly store = inject(NewBookingPageStore);

  // Query params division
  activityId = 0;
  activityPrice = 0;
  availablePlaces = 10;

  // Life-cycle division
  constructor() {
    this.#route.queryParams.subscribe((params) => {
      this.activityId = params['activityId'] || 0;
      this.store.setTitle('Make a booking for ' + params['activityName'] || '');
      this.activityPrice = params['activityPrice'] || 0;
      this.availablePlaces = params['availablePlaces'] || 10;
    });
    effect(() => this.#navigateAfterCreate());
  }

  // Event handlers division
  onCreate(newBooking: NewBookingFormValue) {
    const booking: Partial<Booking> = {
      activityId: this.activityId,
      participants: newBooking.participants,
      payment: {
        method: newBooking.paymentMethod,
        amount: this.activityPrice * newBooking.participants,
        status: 'pending',
      },
    };
    this.store.postBooking$(booking);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.store.postBookingStage() === 'success') {
      this.#router.navigate(['/', 'bookings']);
    }
  }
}
