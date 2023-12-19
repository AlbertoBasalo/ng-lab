import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthStore } from '@auth/auth.store';
import { UserToken } from '@shared/domain/user-token.type';
import { tap } from 'rxjs';
import { Login } from './login/login.type';
import { Register } from './register/register.type';

@Injectable({ providedIn: 'root' })
export class AuthService {
  #authStore = inject(AuthStore);
  #http$ = inject(HttpClient);
  #apiRegisterUrl = 'register';
  #apiLoginUrl = 'login';

  register$(register: Partial<Register>) {
    return this.#http$
      .post<UserToken>(this.#apiRegisterUrl, register)
      .pipe(tap((userToken) => this.#authStore.login(userToken)));
  }

  login$(login: Login) {
    return this.#http$
      .post<UserToken>(this.#apiLoginUrl, login)
      .pipe(tap((userToken) => this.#authStore.login(userToken)));
  }
}
