import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Login } from '@domain/login.type';
import { Register } from '@domain/register.type';
import { UserAccessToken } from '@domain/userAccessToken.type';
import { environment } from '@env/environment';
import { AuthStore } from '@state/auth.store';
import { Observable, tap } from 'rxjs';

/**
 * Repository service for accessing the authentication data from the API
 */
@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  // * Private properties division

  /** The API URL for the users  */
  #apiUrl = `${environment.apiUrl}`;

  // * Injected services division

  /** The HTTP client to make requests to the API */
  #http = inject(HttpClient);
  /** The Store to save the API response with the JWT */
  #authStore = inject(AuthStore);

  // * Public methods division

  /** Post a new user register Data
   * @param register The register data to post
   * @returns An observable with the user access token
   */
  postRegister$(register: Register): Observable<UserAccessToken> {
    return this.#http
      .post<UserAccessToken>(`${this.#apiUrl}/register`, register)
      .pipe(tap((userAccessToken) => this.#authStore.setState(userAccessToken)));
  }

  /** Post a new user login Data
   * @param login The login data to post
   * @returns An observable with the user access token
   */
  postLogin$(login: Login): Observable<UserAccessToken> {
    return this.#http
      .post<UserAccessToken>(`${this.#apiUrl}/login`, login)
      .pipe(tap((userAccessToken) => this.#authStore.setState(userAccessToken)));
  }
}
