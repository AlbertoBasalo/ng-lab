import { Injectable } from '@angular/core';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { WindowService } from '@shared/services/window.service';

@Injectable({ providedIn: 'root' })
export class AuthStorageEffect {
  #key = 'lab_user-token';
  get userToken(): UserToken {
    return this.#load();
  }
  set userToken(userToken: UserToken) {
    this.#save(userToken);
  }
  constructor(private window: WindowService) {}
  #save(userToken: UserToken): void {
    this.window.setLocalStorage(this.#key, userToken);
  }
  #load(): UserToken {
    return this.window.getLocalStorage(this.#key) ?? NULL_USER_TOKEN;
  }
}
