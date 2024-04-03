import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Notification } from '@domain/notification.type';

/**
 * Store for managing notifications
 * @property {Signal<Notification[]>} notifications The list of notifications
 * @property {Signal<number>} count The number of notifications
 * @method addNotification Adds a notification to the list
 * @method clearNotifications Clears all notifications
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationsStore {
  // * Signal division

  #state: WritableSignal<Notification[]> = signal<Notification[]>([]);

  // * Computed properties division

  /** The list of notifications */
  notifications: Signal<Notification[]> = this.#state.asReadonly();
  /** The number of notifications */
  count: Signal<number> = computed(() => this.#state().length);

  // * Methods division

  /**
   * Adds a notification to the list
   * @param notification The notification to add
   */
  addNotification(notification: Notification): void {
    this.#state.update((current) => [...current, notification]);
  }
  /**
   * Clears all notifications
   */
  clearNotifications(): void {
    this.#state.set([]);
  }
}
