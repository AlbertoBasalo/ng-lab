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

/**
 * Store to manage user notifications
 */
@Injectable({ providedIn: 'root' })
export class NotificationsStore {
  // State division
  readonly #notificationsQueue = signal<Notification[]>([]);

  // Selectors division
  /**
   * Signal indicating if there are pending notifications
   */
  hasNext = computed(() => this.#notificationsQueue().length > 0);
  /**
   * Signal with the current notification
   */
  next = computed(() => this.#notificationsQueue()[0]);

  // Commands division

  /**
   * To ask the user a question
   * @param question Configured question
   */
  ask(question: NotificationQuestion) {
    const notification: Notification = {
      type: 'question',
      ...question,
    };
    this.#addNotification(notification);
  }
  /**
   * To show a success message
   * @param alert Configured alert
   */
  showSuccess(alert: NotificationInfo) {
    const notification: Notification = {
      type: 'success',
      ...alert,
    };
    this.#addNotification(notification);
  }
  /**
   * To show a failure message
   * @param alert Configured alert
   */
  showFailure(alert: NotificationInfo) {
    const notification: Notification = {
      type: 'failure',
      ...alert,
    };
    this.#addNotification(notification);
  }
  /**
   * Remove a notification from the queue
   * @description To be used after the user has read the notification
   * @param notification Notification to remove
   */
  remove(notification: Notification) {
    this.#notificationsQueue.update((notifications) => notifications.filter((n) => n !== notification));
  }

  #addNotification(notification: Notification) {
    this.#notificationsQueue.update((notifications) => [...notifications, notification]);
  }
}
