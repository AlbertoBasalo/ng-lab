import { Injectable, Injector, inject } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { PageStore } from '@shared/services/page.store';
import { AuthService } from '../auth.service';
import { Login } from './login.type';

@Injectable()
export class LoginPageStore extends PageStore {
  // Injection division
  readonly #service = inject(AuthService);

  // State division
  #postLoginStatus = this.addNewState<UserToken>(NULL_USER_TOKEN);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Login with your credentials.');
  }

  // Commands division
  postLogin(login: Login) {
    return this.connectCommandToState(this.#service.login$(login), this.#postLoginStatus);
  }
}
