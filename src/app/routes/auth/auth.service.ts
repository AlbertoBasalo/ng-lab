import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthStore } from '@shared/auth.store';
import { UserToken } from '@shared/user-token.dto';
import { tap } from 'rxjs';
import { Login } from './login.dto';
import { Register } from './register.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #store$ = inject(AuthStore);
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/';

  register$(register: Register) {
    const url = `${this.#apiUrl}register`;
    return this.#http$
      .post<UserToken>(url, register)
      .pipe(tap((userToken) => this.#store$.saveUserToken(userToken)));
  }

  login$(login: Login) {
    const url = `${this.#apiUrl}login`;
    return this.#http$
      .post<UserToken>(url, login)
      .pipe(tap((userToken) => this.#store$.saveUserToken(userToken)));
  }
}
