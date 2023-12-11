import { Injectable, computed, signal } from '@angular/core';

export type NotificationType = 'success' | 'failure' | 'question';
export type NotificationInfo = {
  title: string;
  message: string;
};
export type NotificationQuestion = {
  title: string;
  message: string;
  acceptText: string;
  cancelText: string;
  action: () => void;
};
export type Notification = {
  type: NotificationType;
} & NotificationInfo &
  Partial<NotificationQuestion>;

@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  #notificationsQueue = signal<Notification[]>([]);

  pending = computed(() => this.#notificationsQueue()[0] ?? null);

  ask(question: NotificationQuestion) {
    const notification: Notification = {
      type: 'question',
      ...question,
    };
    this.#addNotification(notification);
  }
  showSuccess(alert: NotificationInfo) {
    const notification: Notification = {
      type: 'success',
      ...alert,
    };
    this.#addNotification(notification);
  }
  showFailure(alert: NotificationInfo) {
    const notification: Notification = {
      type: 'failure',
      ...alert,
    };
    this.#addNotification(notification);
  }

  removePending() {
    const pending = this.pending();
    if (!pending) return;
    this.removeNotification(pending);
  }

  removeNotification(notification: Notification) {
    this.#notificationsQueue.update((notifications) =>
      notifications.filter((n) => n !== notification),
    );
  }

  #addNotification(notification: Notification) {
    this.#notificationsQueue.update((notifications) => [
      ...notifications,
      notification,
    ]);
  }
}
