import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore } from '@auth/auth.store';
import { LoggerService } from '@log/logger.service';
import { LogLevel } from '@log/logger.type';
import { Booking } from '@shared/domain/booking.type';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { NewBookingForm, NewBookingFormValue } from './new-booking.form';
import { NewBookingStore } from './new-booking.store';

@Component({
  standalone: true,
  imports: [PageTemplate, NewBookingForm, ErrorComponent],
  providers: [NewBookingStore],
  template: `
    <lab-page [title]="title">
      <lab-new-booking [availablePlaces]="availablePlaces" (create)="onCreate($event)" />
      @if (postBookingStage() === 'error') {
        <lab-error [error]="postBookingError()" />
      }
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NewBookingPage {
  // Injection division
  readonly #router = inject(Router);
  readonly #authStore = inject(AuthStore);
  readonly #route = inject(ActivatedRoute);
  readonly #store = inject(NewBookingStore);
  readonly #logger = inject(LoggerService);

  // Query params division
  activityId = 0;
  activityPrice = 0;
  availablePlaces = 10;

  // data division
  title = 'Make a booking';
  postBookingStage = this.#store.postBookingStage;
  postBookingError = this.#store.postBookingError;

  // Life-cycle division
  constructor() {
    this.#route.queryParams.subscribe((params) => {
      this.title = 'Make a booking for ' + params['activityName'] || '';
      this.activityId = params['activityId'] || 0;
      this.activityPrice = params['activityPrice'] || 0;
      this.availablePlaces = params['availablePlaces'] || 10;
    });
    effect(() => this.#navigateAfterCreate());
  }

  // Event handlers division
  onCreate(newBooking: NewBookingFormValue) {
    const booking: Partial<Booking> = {
      activityId: this.activityId,
      userId: this.#authStore.userId(),
      participants: newBooking.participants,
      date: new Date(),
      payment: {
        method: newBooking.paymentMethod,
        amount: this.activityPrice * newBooking.participants,
        status: 'pending',
      },
    };
    this.#store.postBooking(booking);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.postBookingStage() === 'success') {
      const logEntry = {
        level: LogLevel.info,
        message: 'Booking created successfully',
        payload: this.#store.postBookingResult(),
      };
      this.#logger.log(logEntry);
      this.#router.navigate(['/', 'bookings']);
    }
  }
}
