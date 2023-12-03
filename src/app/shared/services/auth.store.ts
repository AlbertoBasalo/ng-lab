import { Injectable, computed, inject, signal } from '@angular/core';
import { WindowService } from '../../core/window.service';
import { NULL_USER_TOKEN, UserToken } from '../domain/user-token.type';

/**
 * A store to manage all state related to authentication
 * @description Authentication status, user token.
 * To be used from Guards, Interceptors, Components and Services.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  #window = inject(WindowService);
  #userToken = signal<UserToken>(NULL_USER_TOKEN);
  #key = 'lab_user-token';

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

  constructor() {
    const userToken = this.#window.getLocalStorage(this.#key);
    if (!userToken) return;
    this.#userToken.set(userToken);
  }

  /**
   * Saves and emits the user token
   */
  saveUserToken(userToken: UserToken) {
    this.#userToken.set(userToken);
    this.#window.setLocalStorage(this.#key, userToken);
  }

  /**
   * Clears and emits the null user token
   */
  clearUserToken() {
    this.#userToken.set(NULL_USER_TOKEN);
    this.#window.setLocalStorage(this.#key, NULL_USER_TOKEN);
  }
}
