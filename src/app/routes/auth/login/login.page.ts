import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { LoginForm } from './login.form';
import { LoginStore } from './login.store';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginStore],
  imports: [PageTemplate, RouterLink, LoginForm],
  template: `
    <lab-page [title]="title">
      <lab-login (login)="onLogin($event)" />
      <a routerLink="/auth/register">Register if you don't have an account</a>
    </lab-page>
  `,
})
export default class LoginPage {
  // Injection division
  readonly #store = inject(LoginStore);

  // data division
  title = 'Login';

  // Event handlers division
  onLogin(login: Login) {
    this.#store.postLogin(login);
  }
}
