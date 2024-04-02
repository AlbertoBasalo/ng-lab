import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '@domain/login.type';
import { ControlComponent } from '@ui/control.component';

/**
 * Form component for logging in
 * Emits the Login when the form is submitted
 */
@Component({
  selector: 'lab-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ControlComponent],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <lab-control controlName="email" labelDisplay="Email" [errors]="form.controls['email'].errors">
        <input id="email" type="email" formControlName="email" [attr.aria-invalid]="form.controls['email'].invalid" />
      </lab-control>
      <lab-control controlName="password" labelDisplay="Password" [errors]="form.controls['password'].errors">
        <input
          id="password"
          type="password"
          formControlName="password"
          [attr.aria-invalid]="form.controls['password'].invalid" />
      </lab-control>

      <button type="submit" [disabled]="form.invalid">Login</button>
    </form>
  `,
})
export class LoginForm {
  // * Outputs division

  /** Emits the Login when the form is submitted */
  login = output<Login>();

  // * Properties division

  /** The form to login */
  form: FormGroup = new FormGroup({
    email: new FormControl('a@b.c', [Validators.required, Validators.email]),
    password: new FormControl('123456', Validators.required),
  });

  // * Event handlers division

  /**
   * Handles the form submission
   */
  onSubmit() {
    if (this.form.valid) {
      this.login.emit(this.form.value);
    }
  }
}
