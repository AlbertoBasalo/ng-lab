import { Injectable, computed, signal } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from './user-token.dto';

/**
 * A store to manage all state related to authentication
 * @description Authentication status, user token.
 * To be used from Guards, Interceptors, Components and Services.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  #userToken = signal<UserToken>(NULL_USER_TOKEN);

  /**
   * Signal with the current access token
   * @description TO be used on HTTP Interceptors
   */
  readonly accessToken = computed(() => this.#userToken().accessToken);

  /**
   * Signal with the current user profile
   * @description To be used on components
   */
  readonly user = computed(() => this.#userToken().user);

  /**
   * Signal with the current authentication status
   * @description To be used on components
   */
  readonly isAuthenticated = computed(() => !!this.accessToken());

  /**
   * Saves and emits the user token
   */
  saveUserToken(userToken: UserToken) {
    this.#userToken.set(userToken);
  }

  /**
   * Clears and emits the null user token
   */
  clearUserToken() {
    this.#userToken.set(NULL_USER_TOKEN);
  }
}