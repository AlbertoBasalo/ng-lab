import { Injectable, Injector, inject } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { PageStore } from '@shared/services/page.store';
import { AuthService } from '../auth.service';
import { Register } from './register.type';

@Injectable()
export class RegisterPageStore extends PageStore {
  // Injection division
  readonly #service$ = inject(AuthService);

  // State division
  #postRegister = this.addNewState<UserToken>(NULL_USER_TOKEN);

  constructor(injector: Injector) {
    super(injector);
    this.setTitle('Register to create your account.');
  }

  // Commands division
  postRegister(register: Partial<Register>) {
    return this.connectCommandToState(this.#service$.register$(register), this.#postRegister);
  }
}
