import { isPlatformServer } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * Service to access the window object when running on the browser
 * @description Avoids errors when running the app on the server
 */
@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  // * Private injection division

  /**  Id of the platform used to determine if the app is running on the server or the browser */
  #platformId: Object = inject(PLATFORM_ID);

  // * Public properties division

  /** True when the app si running on the server */
  get isServer(): boolean {
    return isPlatformServer(this.#platformId);
  }

  /** True when the app is running on the browser */
  get isBrowser(): boolean {
    return !this.isServer;
  }

  constructor() {
    if (this.isServer) this.#overrideConsoleLog();
  }

  // * Private methods division

  /**
   * Overrides the console log methods to avoid errors when running on the server
   */
  #overrideConsoleLog(): void {
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
