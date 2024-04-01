import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '@domain/register.type';
import { ControlComponent } from '@ui/control.component';
import { matchValidator } from '@ui/form.functions';

@Component({
  selector: 'lab-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, ControlComponent],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <lab-control controlName="username" labelDisplay="Username" [errors]="form.controls['username'].errors">
        <input
          id="username"
          type="text"
          formControlName="username"
          [attr.aria-invalid]="form.controls['username'].invalid" />
      </lab-control>
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
      <lab-control controlName="confirm" labelDisplay="Confirm Password" [errors]="form.controls['confirm'].errors">
        <input
          id="confirm"
          type="password"
          formControlName="confirm"
          [attr.aria-invalid]="form.controls['confirm'].invalid" />
      </lab-control>
      <label for="terms">
        <span>Accept the terms and conditions</span>
        <input
          id="terms"
          type="checkbox"
          formControlName="terms"
          [attr.aria-invalid]="form.controls['terms'].invalid" />
      </label>
      <button type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `,
})
export class RegisterForm {
  register = output<Register>();

  form: FormGroup = new FormGroup(
    {
      username: new FormControl('A', Validators.required),
      email: new FormControl('a@b.c', [Validators.required, Validators.email]),
      password: new FormControl('1234', [Validators.required, Validators.minLength(4)]),
      confirm: new FormControl('123', [Validators.required, Validators.minLength(4)]),
      terms: new FormControl(false, Validators.requiredTrue),
    },
    {
      validators: matchValidator('password', 'confirm'),
    },
  );

  onSubmit() {
    if (this.form.valid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirm, ...register } = this.form.value;
      this.register.emit(register);
    }
  }
}
