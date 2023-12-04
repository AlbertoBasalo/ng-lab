import { Injectable } from '@angular/core';
import { WindowService } from '@core/window.service';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';

@Injectable({ providedIn: 'root' })
export class StorageEffect {
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
