import { Injectable, inject } from '@angular/core';
import { PlatformService } from './platform.service';

/**
 * Service to access the local storage
 * It uses the platform service to determine if the app is running on the server or the browser
 */
@Injectable({
  providedIn: 'root',
})
export class LocalRepository {
  // * Injected services division

  /**  Service to access the platform used to determine if the app is running on the server or the browser*/
  #platformService = inject(PlatformService);

  /**
   * Saves a value in the local storage
   * @param key The key to save the value with
   * @param value The serializable value to save
   */
  save(key: string, value: any): void {
    if (this.#platformService.isServer) return;
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  }

  /**
   * Loads a generic value from the local storage
   * @typeParam T The concrete type of the value to load
   * @param key The key to load the value from
   * @param defaultValue The default value to return if the key is not found
   * @returns The value found or the default value
   */
  load<T>(key: string, defaultValue: T): T {
    if (this.#platformService.isServer) return defaultValue;
    const found = localStorage.getItem(key);
    if (found) {
      return JSON.parse(found);
    }
    this.save(key, defaultValue);
    return defaultValue;
  }

  /**
   * Removes a value from the local storage
   * @param key The key to remove
   */
  remove(key: string): void {
    if (this.#platformService.isServer) return;
    localStorage.removeItem(key);
  }
}
