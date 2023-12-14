import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentMethod } from '@shared/domain/booking.type';
import { markError, showError } from '@shared/ui/form.utils';

export type NewBookingFormValue = {
  participants: number;
  paymentMethod: PaymentMethod;
};

@Component({
  selector: 'lab-new-booking',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <fieldset>
        <label for="participants">
          <span>Participants</span>
          @if (showError('participants')) {
            <small id="participants-error">We need a valid number of participants</small>
          }
          <input
            type="number"
            id="participants"
            name="participants"
            formControlName="participants"
            autocomplete="off"
            min="1"
            max="{{ availablePlaces }}"
            [attr.aria-invalid]="markError('participants')"
          />
        </label>
        <label for="paymentMethod">
          <span>Payment method</span>
          @if (showError('paymentMethod')) {
            <small id="paymentMethod-error">We need a valid payment method</small>
          }
          <select
            id="paymentMethod"
            name="paymentMethod"
            formControlName="paymentMethod"
            autocomplete="off"
            [attr.aria-invalid]="markError('paymentMethod')"
          >
            <option value="creditCard">Credit card</option>
            <option value="cash">Cash</option>
            <option value="paypal">Paypal</option>
          </select>
        </label>
        <button type="submit">Book</button>
      </fieldset>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBookingForm {
  // I/O division
  @Input({ required: true }) availablePlaces!: number;
  @Output() create = new EventEmitter<NewBookingFormValue>();

  // Data division
  form = new FormGroup({
    participants: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.max(this.availablePlaces)],
    }),
    paymentMethod: new FormControl<PaymentMethod>('creditCard', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  // Utils division
  showError(controlName: string) {
    return showError(this.form, controlName);
  }
  markError(controlName: string) {
    return markError(this.form, controlName);
  }

  // Event handlers division
  onSubmit() {
    this.create.emit(this.form.value as NewBookingFormValue);
  }
}
