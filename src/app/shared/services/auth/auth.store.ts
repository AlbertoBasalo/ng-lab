import { Injectable, computed, effect, signal } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '../../domain/user-token.type';
import { AuthNavigationEffect } from './auth-navigation.effect';
import { AuthStorageEffect } from './auth-storage.effect';
import { AuthState } from './auth.type';

/**
 * A store to manage all state related to authentication
 * @description Authentication status, user token.
 * To be used from Guards, Interceptors, Components and Services.
 */
@Injectable({ providedIn: 'root' })
export class AuthStore {
  #authState = signal<AuthState>({
    userToken: NULL_USER_TOKEN,
    authProcess: { interactive: false, url: '' },
  });

  /**
   * Signal with the current user and access token
   */
  readonly userToken = computed(() => this.#authState().userToken);

  /**
   * Signal with the current user and access token
   */
  readonly authProcess = computed(() => this.#authState().authProcess);
  /**
   * Signal with the current access token
   * @description TO be used on HTTP Interceptors
   */
  readonly accessToken = computed(() => this.userToken().accessToken);

  /**
   * Signal with the current user profile
   * @description To be used on components
   */
  readonly user = computed(() => this.userToken().user);

  /**
   * Signal with the current user id
   * @description To be used to appeend to DTOs or url...
   */
  readonly userId = computed(() => this.user().id);

  /**
   * Signal with the current authentication status
   * @description To be used on components
   */
  readonly isAuthenticated = computed(() => !!this.accessToken());

  /**
   * Store to manage all state related to authentication
   * @param navigation Service to navigate the user as a side effect
   * @param storage Service to save the user token as a side effect
   */
  constructor(navigation: AuthNavigationEffect, storage: AuthStorageEffect) {
    this.#authState.update((state) => ({
      ...state,
      userToken: storage.userToken,
    }));
    effect(() => (storage.userToken = this.userToken()));
    effect(() => navigation.navigate(this.authProcess()));
  }

  /**
   * Saves and emits the user token
   */
  login(userToken: UserToken) {
    this.#authState.update((state) => ({
      authProcess: {
        ...state.authProcess,
        interactive: true,
        mustLogin: false,
      },
      userToken: userToken,
    }));
  }

  /**
   * Clears and emits the null user token
   */
  logout() {
    this.#authState.update((state) => ({
      authProcess: { interactive: true, mustLogin: true, url: '' },
      userToken: NULL_USER_TOKEN,
    }));
  }

  /**
   * Sets an auth detected error
   * @description To be used from guards and interceptors
   * @param url The url to redirect to after login
   */
  mustLogin(url: string = '') {
    this.#authState.update((state) => ({
      authProcess: { interactive: true, mustLogin: true, url },
      userToken: NULL_USER_TOKEN,
    }));
  }
}
