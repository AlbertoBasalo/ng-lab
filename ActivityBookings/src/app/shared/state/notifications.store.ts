import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

export type Notification = { message: string; type: 'info' | 'error' };

@Injectable({
  providedIn: 'root',
})
export class NotificationsStore {
  #state: WritableSignal<Notification[]> = signal<Notification[]>([]);

  notifications: Signal<Notification[]> = this.#state.asReadonly();

  count: Signal<number> = computed(() => this.#state().length);

  hasNotifications: Signal<boolean> = computed(() => this.count() > 0);

  addNotification(notification: Notification): void {
    this.#state.update((current) => [...current, notification]);
  }

  clearNotifications(): void {
    this.#state.set([]);
  }
}
