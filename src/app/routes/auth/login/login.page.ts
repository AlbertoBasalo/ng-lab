import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { LoginForm } from './login.form';
import { LoginStore } from './login.store';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoginStore],
  imports: [PageTemplate, RouterLink, LoginForm, ErrorComponent],
  template: `
    <lab-page [title]="title">
      <lab-login (login)="onLogin($event)" />
      <a routerLink="/auth/register">Register if you don't have an account</a>
      @if (postLoginError()) {
        <lab-error [error]="postLoginError()" />
      }
    </lab-page>
  `,
})
export default class LoginPage {
  // Injection division
  readonly #store = inject(LoginStore);

  // data division
  title = 'Login';
  postLoginError = this.#store.postLoginError;

  // Event handlers division
  onLogin(login: Login) {
    this.#store.postLogin(login);
  }
}
