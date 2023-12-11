import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { LogLevel, LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class WindowService {
  #log = inject(LogService);
  #isServer = isPlatformServer(inject(PLATFORM_ID));

  get isServer() {
    return this.#isServer;
  }

  get isBrowser() {
    return !this.#isServer;
  }

  constructor() {
    this.overrideConsoleLog();
  }

  private overrideConsoleLog() {
    console.log = (message?: any, ...optionalParams: any[]) => {
      if (this.#isServer) return;
      this.#log.log({
        level: LogLevel.info,
        message: message,
        source: '👷🏼 Application',
        payload: optionalParams,
      });
    };
    console.error = (message?: any, ...optionalParams: any[]) => {
      if (this.#isServer) return;
      this.#log.log({
        level: LogLevel.error,
        message: message,
        source: '👷🏼 Application',
        payload: optionalParams,
      });
    };
    console.warn = (message?: any, ...optionalParams: any[]) => {
      if (this.#isServer) return;
      this.#log.log({
        level: LogLevel.warn,
        message: message,
        source: '👷🏼 Application',
        payload: optionalParams,
      });
    };
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
  // displayAlert(alert: { title: string; message: string }) {
  //   if (this.#isServer) return;
  //   window.alert(`${alert.title}\n${alert.message}`);
  // }
}
