import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterForm } from './register.form';

@Component({
  standalone: true,
  imports: [RegisterForm],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-register />
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  title = 'Register to create your account.';
}
