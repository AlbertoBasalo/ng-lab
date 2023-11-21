import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { RegisterForm } from './register.form';

@Component({
  standalone: true,
  imports: [RegisterForm],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-register (register)="onRegister($event)" />
      <footer>
        <a routerLink="/auth/login">Login if you already have an account</a>
      </footer>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  #service$ = inject(AuthService);
  title = 'Register to create your account.';
  onRegister(event: any) {
    this.#service$.register$(event).subscribe((response) => {
      console.log(response);
    });
  }
}
