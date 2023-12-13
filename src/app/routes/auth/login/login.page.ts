import { ChangeDetectionStrategy, Component, Injector, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connect } from '@shared/services/command.signal';
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
    <lab-page [title]="title" [status]="status">
      <lab-login (login)="onLogin($event)" />
      <a routerLink="/auth/register">Register if you don't have an account</a>
    </lab-page>
  `,
})
export default class LoginPage {
  #service = inject(AuthService);
  #store = inject(PageStore);
  #injector = inject(Injector);
  title = 'Login with your credentials.';
  error = signal<string>('');
  status = this.#store.commandStatus;
  #postLogin = this.#store.createSignal<UserToken>(NULL_USER_TOKEN);

  onLogin(login: Login) {
    const source$ = this.#service.login$(login);
    connect(source$, this.#postLogin, this.#injector);
  }
}
