import { ChangeDetectionStrategy, Component, Injector, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connectSignal } from '@shared/services/command.signal';
import { PageStore } from '@shared/services/page.store';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { AuthService } from '../auth.service';
import { LoginForm } from './login.form';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService],
  imports: [PageTemplate, RouterLink, LoginForm, ErrorComponent],
  template: `
    <lab-page [store]="store">
      <lab-login (login)="onLogin($event)" />
      <a routerLink="/auth/register">Register if you don't have an account</a>
    </lab-page>
  `,
})
export default class LoginPage {
  // Injection division
  #injector = inject(Injector);
  #service = inject(AuthService);
  store = inject(PageStore);

  // Data division
  #postLogin = this.store.addNewStatusSignal<UserToken>(NULL_USER_TOKEN);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Login with your credentials.');
  }

  // Event handlers division
  onLogin(login: Login) {
    const source$ = this.#service.login$(login);
    connectSignal(source$, this.#postLogin, this.#injector);
  }
}
