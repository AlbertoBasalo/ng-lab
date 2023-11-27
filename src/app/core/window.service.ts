import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WindowService {
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  get isServer() {
    return this.#isServer;
  }

  get isBrowser() {
    return !this.#isServer;
  }

  setLocalStorage(key: string, value: object) {
    if (this.#isServer) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  getLocalStorage(key: string) {
    if (this.#isServer) return null;
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
  removeLocalStorage(key: string) {
    if (this.#isServer) return;
    window.localStorage.removeItem(key);
  }
  displayAlert(alert: { title: string; message: string }) {
    if (this.#isServer) return;
    window.alert(`${alert.title}\n${alert.message}`);
  }
}
