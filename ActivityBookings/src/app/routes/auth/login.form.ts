import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '@domain/login.type';

@Component({
  selector: 'lab-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <form [formGroup]="form" (submit)="onSubmit()">
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

      <button type="submit" [disabled]="form.invalid">Login</button>
    </form>
  `,
})
export class LoginForm {
  login = output<Login>();

  form: FormGroup = new FormGroup({
    email: new FormControl('a@b.c', [Validators.required, Validators.email]),
    password: new FormControl('123456', Validators.required),
  });

  onSubmit() {
    if (this.form.valid) {
      this.login.emit(this.form.value);
    }
  }
}
