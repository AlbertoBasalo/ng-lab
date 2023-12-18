import { Injectable, Injector, inject } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { AuthService } from '../auth.service';
import { Login } from './login.type';

@Injectable()
export class LoginStore {
  // Injection division
  readonly #service = inject(AuthService);
  readonly #injector = inject(Injector);

  // State division
  #postLoginState = createCommandState<UserToken>(NULL_USER_TOKEN);

  // Commands division
  postLogin(login: Login) {
    connectCommandState(this.#service.login$(login), this.#postLoginState, this.#injector);
  }
}
