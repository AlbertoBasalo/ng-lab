import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';

import { NULL_USER_ACCESS_TOKEN, UserAccessToken } from '@domain/userAccessToken.type';
import { LocalRepository } from '@services/local.repository';

/**
 * Signal Store for the Authentication data
 * @description The Authentication State is the User Access Token
 * @see UserAccessToken
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // * Injected services division

  /** To save and load the Authentication State from the local storage*/
  #localRepository: LocalRepository = inject(LocalRepository);

  // * Private properties division

  /** Signal to store the Authentication State as private state
   * @description Prefilled with the value from the local storage
   */
  #state: WritableSignal<UserAccessToken> = signal<UserAccessToken>(
    this.#localRepository.load('userAccessToken', NULL_USER_ACCESS_TOKEN),
  );

  // * Computed properties division

  /** Signal true if user is authenticated */
  isAuthenticated: Signal<boolean> = computed(() => this.#state().accessToken !== '');
  /** Signal true if user is anonymous */
  isAnonymous: Signal<boolean> = computed(() => this.#state().accessToken === '');
  /** Signal with the current user id */
  userId: Signal<number> = computed(() => this.#state().user.id);
  /** Signal with the current user access token */
  accessToken: Signal<string> = computed(() => this.#state().accessToken);

  // * Public method division

  /** Saves the new state of the Authentication State
   * @param userAccessToken The new Authentication State to be saved
   * @description Saves the new state to the local storage
   * @description Redirects to the login page if the access token is empty
   */
  setState(userAccessToken: UserAccessToken): void {
    this.#state.set(userAccessToken);
    this.#localRepository.save('userAccessToken', userAccessToken);
  }
}
