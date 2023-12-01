import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserToken } from '@shared/domain/user-token.type';
import { AuthStore } from '@shared/services/auth.store';
import { tap } from 'rxjs';
import { Login } from './login/login.type';
import { Register } from './register/register.type';

export class AuthService {
  #store$ = inject(AuthStore);
  #http$ = inject(HttpClient);

  register$(register: Register) {
    const url = `register`;
    return this.#http$
      .post<UserToken>(url, register)
      .pipe(tap((userToken) => this.#store$.saveUserToken(userToken)));
  }

  login$(login: Login) {
    const url = `login`;
    return this.#http$
      .post<UserToken>(url, login)
      .pipe(tap((userToken) => this.#store$.saveUserToken(userToken)));
  }
}
