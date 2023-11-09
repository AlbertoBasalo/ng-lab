import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lab-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <fieldset>
        <label for="username">
          <span>User name</span>
          @if (showError('username')){
          <small id="username-error">We need your name</small>
          }
          <input
            type="text"
            id="username"
            formControlName="username"
            autocomplete="cc-name"
            [attr.aria-invalid]="form.controls['username'].invalid"
          />
        </label>
        <label for="email">
          <span>Email</span>
          @if (form.controls['email'].invalid){
          <small id="email-error">We need your email</small>
          }
          <input
            type="email"
            id="email"
            formControlName="email"
            autocomplete="off"
            [attr.aria-invalid]="form.controls['email'].invalid"
          />
        </label>
        <label for="password">
          <span>Password</span>
          @if (form.controls['password'].invalid){
          <small id="password-error">We need your password</small>
          }
          <input
            type="password"
            id="password"
            formControlName="password"
            autocomplete="new-password"
            [attr.aria-invalid]="form.controls['password'].invalid"
          />
        </label>
        <label for="repeatPassword">
          <span>Repeat your Password</span>
          @if (form.controls['repeatPassword'].invalid){
          <small id="repeatPassword-error">We need your password</small>
          }
          <input
            type="password"
            id="repeatPassword"
            formControlName="repeatPassword"
            [attr.aria-invalid]="form.controls['repeatPassword'].invalid"
          />
        </label>
      </fieldset>
      <button type="submit" [disabled]="form.invalid">Register</button>
      <input type="reset" value="Reset form" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterForm {
  readonly #passwordValidators = [Validators.required, Validators.minLength(4)];

  form = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', this.#passwordValidators),
    repeatPassword: new FormControl('', this.#passwordValidators),
  });

  showError(controlName: string) {
    const control: AbstractControl | null = this.form.get(controlName);
    return control && control.invalid && control.touched;
  }
}
