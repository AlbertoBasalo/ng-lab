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
import { markError, passwordValidators, showError } from '@shared/form.utils';

@Component({
  selector: 'lab-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <fieldset>
        <label for="email">
          <span>Email</span>
          @if (form.controls['email'].invalid) {
            <small id="email-error">We need your email</small>
          }
          <input
            type="email"
            id="email"
            name="email"
            formControlName="email"
            autocomplete="off"
            [attr.aria-invalid]="markError('email')"
          />
        </label>
        <label for="password">
          <span>Password</span>
          @if (form.controls['password'].invalid) {
            <small id="password-error">We need your password</small>
          }
          <input
            type="password"
            id="password"
            name="password"
            formControlName="password"
            autocomplete="new-password"
            [attr.aria-invalid]="markError('password')"
          />
        </label>
      </fieldset>
      <button type="submit" [disabled]="form.invalid" (click)="onSubmit()">
        Login
      </button>
      <input type="reset" value="Reset form" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginForm {
  @Output() login = new EventEmitter<any>();

  /**
   * The form group with all the controls (initial values and validators)
   */
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', passwordValidators),
  });

  showError(controlName: string) {
    return showError(this.form, controlName);
  }

  markError(controlName: string) {
    return markError(this.form, controlName);
  }

  onSubmit() {
    this.login.emit(this.form.value);
  }
}
