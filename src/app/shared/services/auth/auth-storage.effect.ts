import { Injectable, inject } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { WindowService } from '@shared/services/window.service';

/**
 * Effect to save and load the user token from the local storage
 */
@Injectable({ providedIn: 'root' })
export class AuthStorageEffect {
  #window = inject(WindowService);
  #key = 'lab_user-token';

  get userToken(): UserToken {
    return this.#load();
  }
  set userToken(userToken: UserToken) {
    this.#save(userToken);
  }

  #save(userToken: UserToken): void {
    this.#window.setLocalStorage(this.#key, userToken);
  }
  #load(): UserToken {
    return this.#window.getLocalStorage(this.#key) ?? NULL_USER_TOKEN;
  }
}
