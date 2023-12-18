import { Injectable, Injector, inject } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connectCommandToSignal, createCommandSignal } from '@shared/services/command.state';
import { AuthService } from '../auth.service';
import { Login } from './login.type';

@Injectable()
export class LoginPageStore {
  // Injection division
  readonly #service = inject(AuthService);
  readonly #injector = inject(Injector);

  // State division
  #postLoginState = createCommandSignal<UserToken>(NULL_USER_TOKEN);

  // Commands division
  postLogin(login: Login) {
    connectCommandToSignal(this.#service.login$(login), this.#postLoginState, this.#injector);
  }
}
