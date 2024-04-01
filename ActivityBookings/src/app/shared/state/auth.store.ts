import { Injectable, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { NULL_USER_ACCESS_TOKEN, UserAccessToken } from '@domain/userAccesToken.type';
import { LocalRepository } from '@services/local.repository';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  // * Injected services division

  /** To save and load the favorites from the local storage*/
  #localRepository: LocalRepository = inject(LocalRepository);

  #state: WritableSignal<UserAccessToken> = signal<UserAccessToken>(NULL_USER_ACCESS_TOKEN);

  isAuthenticated: Signal<boolean> = computed(() => this.#state().accessToken !== '');
  isAnonymous: Signal<boolean> = computed(() => this.#state().accessToken === '');
  userId: Signal<string> = computed(() => this.#state().user.id);

  setState(userAccessToken: UserAccessToken): void {
    this.#state.set(userAccessToken);
  }
}
