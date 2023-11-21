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
import {
  markError,
  passwordValidators,
  showError,
} from '@shared/form.function';

@Component({
  selector: 'lab-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <fieldset>
        <label for="username">
          <span>User name</span>
          @if (showError('username')) {
            <small id="username-error">We need your name</small>
          }
          <input
            type="text"
            id="username"
            name="username"
            formControlName="username"
            autocomplete="off"
            [attr.aria-invalid]="markError('username')"
          />
        </label>
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
        <label for="repeatPassword">
          <span>Repeat your Password</span>
          @if (form.controls['repeatPassword'].invalid) {
            <small id="repeatPassword-error">We need your password</small>
          }
          <input
            type="password"
            id="repeatPassword"
            formControlName="repeatPassword"
            [attr.aria-invalid]="markError('repeatPassword')"
          />
        </label>
      </fieldset>
      <button type="submit" [disabled]="form.invalid" (click)="onSubmit()">
        Register
      </button>
      <input type="reset" value="Reset form" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  @Output() register = new EventEmitter<any>();

  /**
   * The form group with all the controls (initial values and validators)
   */
  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', passwordValidators),
    repeatPassword: new FormControl('', passwordValidators),
  });

  showError(controlName: string) {
    return showError(this.form, controlName);
  }

  markError(controlName: string) {
    return markError(this.form, controlName);
  }

  onSubmit() {
    // remove repeatPassword from the form value
    const { repeatPassword, ...value } = this.form.value;
    this.register.emit(value);
  }
}
