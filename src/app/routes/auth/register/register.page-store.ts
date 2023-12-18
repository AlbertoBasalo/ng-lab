import { Injectable, Injector, inject } from '@angular/core';
import { NULL_USER_TOKEN } from '@shared/domain/user-token.type';
import { connectCommandToSignal, createCommandSignal } from '@shared/services/command.state';
import { AuthService } from '../auth.service';
import { Register } from './register.type';

@Injectable()
export class RegisterPageStore {
  // Injection division
  readonly #service$ = inject(AuthService);
  readonly #injector = inject(Injector);

  // State division
  #postRegisterState = createCommandSignal(NULL_USER_TOKEN);

  // Commands division
  postRegister(register: Partial<Register>) {
    connectCommandToSignal(this.#service$.register$(register), this.#postRegisterState, this.#injector);
  }
}
