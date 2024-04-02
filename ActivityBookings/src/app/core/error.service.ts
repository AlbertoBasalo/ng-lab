import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { Notification, NotificationsStore } from '@state/notifications.store';
/**
 * Service to handle errors and show notifications
 * @description Must be provided as the ErrorHandler in the app config
 * @implements ErrorHandler
 */
export class ErrorService implements ErrorHandler {
  // * Injected services division

  /** The store to add notifications */
  #notificationsStore: NotificationsStore = inject(NotificationsStore);

  /**
   * Custom error handler to show as notifications
   * @param error The error to handle
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any): void {
    const notification: Notification = { message: 'An error occurred', type: 'error' };
    if (error instanceof HttpErrorResponse) {
      notification.message = error.message;
    } else {
      notification.message = error.toString();
    }
    this.#notificationsStore.addNotification(notification);
  }
}
