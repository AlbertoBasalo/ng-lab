import { Injectable, Injector, computed, inject } from '@angular/core';
import { NULL_USER_TOKEN } from '@shared/domain/user-token.type';
import { connectCommandState, createCommandState } from '@shared/services/command.state';
import { AuthService } from '../auth.service';
import { Register } from './register.type';

@Injectable()
export class RegisterStore {
  // Injection division
  readonly #service$ = inject(AuthService);
  readonly #injector = inject(Injector);

  // State division
  #postRegisterState = createCommandState(NULL_USER_TOKEN);
  postRegisterError = computed(() => this.#postRegisterState().error);

  // Commands division
  postRegister(register: Partial<Register>) {
    connectCommandState(this.#service$.register$(register), this.#postRegisterState, this.#injector);
  }
}
