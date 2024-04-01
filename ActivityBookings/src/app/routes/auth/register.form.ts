import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Register } from '@domain/register.type';
import { matchValidator } from '@ui/form.functions';

@Component({
  selector: 'lab-register',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
      <label for="username">
        <span>Username</span><small>{{ form.controls['username'].errors | json }}</small>
        <input
          id="username"
          type="text"
          formControlName="username"
          [attr.aria-invalid]="form.controls['username'].invalid" />
      </label>
      <label for="email">
        <span>Email</span><small>{{ form.controls['email'].errors | json }}</small>
        <input id="email" type="email" formControlName="email" [attr.aria-invalid]="form.controls['email'].invalid" />
      </label>
      <label for="password">
        <span>Password</span><small>{{ form.controls['password'].errors | json }}</small>
        <input
          id="password"
          type="password"
          formControlName="password"
          [attr.aria-invalid]="form.controls['password'].invalid" />
      </label>
      <label for="confirm">
        <span>Confirm password</span><small>{{ form.controls['confirm'].errors | json }}</small>
        <input
          id="confirm"
          type="password"
          formControlName="confirm"
          [attr.aria-invalid]="form.controls['confirm'].invalid" />
      </label>
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
