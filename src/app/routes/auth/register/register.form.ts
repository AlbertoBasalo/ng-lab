import { ChangeDetectionStrategy, Component, EventEmitter, Output, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { markError, passwordValidators, showError } from '@shared/ui/form.utils';
import { Register } from './register.type';

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
        <section class="grid">
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
              <small id="repeatPassword-error">Ensure your password</small>
            }
            <input
              type="password"
              id="repeatPassword"
              formControlName="repeatPassword"
              [attr.aria-invalid]="markError('repeatPassword')"
            />
          </label>
        </section>
        <label for="acceptedTerms">
          <input type="checkbox" id="acceptedTerms" name="acceptedTerms" formControlName="acceptedTerms" />
          <span>I accept the terms and conditions</span>
        </label>
      </fieldset>
      <section class="grid">
        <input type="reset" value="Reset form" class="outline" />
        <button type="submit" [disabled]="form.invalid" (click)="onSubmit()">Register</button>
      </section>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  @Output() register = new EventEmitter<Partial<Register>>();
  fb = inject(NonNullableFormBuilder);
  /**
   * The form group with all the controls (initial values and validators)
   */
  form = this.fb.group({
    username: this.fb.control('', [Validators.required, Validators.minLength(2)]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', passwordValidators),
    repeatPassword: this.fb.control('', passwordValidators),
    acceptedTerms: this.fb.control(false, Validators.requiredTrue),
  });

  showError(controlName: string) {
    return showError(this.form, controlName);
  }

  markError(controlName: string) {
    return markError(this.form, controlName);
  }

  onSubmit() {
    // remove repeated password from the form value
    const { repeatPassword, acceptedTerms, ...user } = this.form.value;
    this.register.emit(user);
  }
}
