import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * Service to access the window object
 * @description Avoids errors when running the app on the server
 */
@Injectable({ providedIn: 'root' })
export class WindowService {
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  get isServer() {
    return this.#isServer;
  }

  get isBrowser() {
    return !this.#isServer;
  }

  constructor() {
    if (this.#isServer) this.#overrideConsoleLog();
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

  #overrideConsoleLog() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      return;
    };
    console.error = (message?: any, ...optionalParams: any[]) => {
      return;
    };
    console.warn = (message?: any, ...optionalParams: any[]) => {
      return;
    };
  }
}
