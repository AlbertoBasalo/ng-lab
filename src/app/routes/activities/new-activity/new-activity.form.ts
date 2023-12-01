import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Activity } from '@shared/domain/activity.type';
import { markError, showError } from '@shared/ui/form.utils';

@Component({
  selector: 'lab-new-activity',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <fieldset>
        <label for="name">
          <span>Name</span>
          @if (showError('name')) {
            <small id="name-error">We need a valid name for the activity</small>
          }
          <input
            type="text"
            id="name"
            name="name"
            formControlName="name"
            autocomplete="off"
            [attr.aria-invalid]="markError('name')"
          />
        </label>
        <label for="date">
          <span>Date</span>
          @if (showError('date')) {
            <small id="date-error">We need a valid date for the activity</small>
          }
          <input
            type="date"
            id="date"
            name="date"
            formControlName="date"
            autocomplete="off"
            [attr.aria-invalid]="markError('date')"
          />
        </label>
        <label for="location">
          <span>Location</span>
          @if (showError('location')) {
            <small id="location-error"
              >We need a valid location for the activity</small
            >
          }
          <input
            type="text"
            id="location"
            name="location"
            formControlName="location"
            autocomplete="off"
            [attr.aria-invalid]="markError('location')"
          />
        </label>
        <label for="price">
          <span>Price</span>
          @if (showError('price')) {
            <small id="price-error"
              >We need a valid price for the activity</small
            >
          }
          <input
            type="number"
            id="price"
            name="price"
            formControlName="price"
            autocomplete="off"
            [attr.aria-invalid]="markError('price')"
          />
        </label>
        <label for="maxParticipants">
          <span>Max Participants</span>
          @if (showError('maxParticipants')) {
            <small id="maxParticipants-error"
              >We need a valid max participants for the activity</small
            >
          }
          <input
            type="number"
            id="maxParticipants"
            name="maxParticipants"
            formControlName="maxParticipants"
            autocomplete="off"
            [attr.aria-invalid]="markError('maxParticipants')"
          />
        </label>
        <label for="minParticipants">
          <span
            >Min Participants
            <small>(optional)</small>
          </span>
          @if (showError('minParticipants')) {
            <small id="minParticipants-error"
              >We need a valid min participants for the activity</small
            >
          }
          <input
            type="number"
            id="minParticipants"
            name="minParticipants"
            formControlName="minParticipants"
            autocomplete="off"
            [attr.aria-invalid]="markError('minParticipants')"
          />
        </label>
      </fieldset>
      <button type="submit" (click)="onSubmit()">Create</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewActivityForm {
  @Output() create = new EventEmitter<Partial<Activity>>();

  // ToDo: add form validations for min<=max participants
  // ToDo: add custom date validator

  form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    date: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    location: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(1000),
      ],
    }),
    maxParticipants: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
    minParticipants: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), Validators.max(100)],
    }),
  });

  showError(controlName: string) {
    return showError(this.form, controlName);
  }

  markError(controlName: string) {
    return markError(this.form, controlName);
  }

  onSubmit() {
    this.create.emit(this.form.value);
  }
}
