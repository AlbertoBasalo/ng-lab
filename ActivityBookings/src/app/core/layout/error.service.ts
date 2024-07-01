import { HttpErrorResponse } from '@angular/common/http';
import { EnvironmentProviders, ErrorHandler, NgZone, inject, makeEnvironmentProviders } from '@angular/core';
import { Notification } from '@domain/notification.type';
import { NotificationsStore } from '@state/notifications.store';

/**
 * Service to handle errors and show notifications.
 * @description Must be provided as the ErrorHandler in the app config function.
 * @extends ErrorHandler
 */
class ErrorService extends ErrorHandler {
  // * Injected services division

  /** The store to add error notifications */
  #notificationsStore: NotificationsStore = inject(NotificationsStore);
  /** The zone to run the notification in, bc this handler runs outside */
  #zone = inject(NgZone);

  /**
   * Custom error handler used to show errors as notifications
   * @param error The error to handle
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override handleError(error: any): void {
    const notification: Notification = { message: 'An error occurred', type: 'error' };
    if (error instanceof HttpErrorResponse) {
      notification.message = error.message;
    } else {
      notification.message = error.toString();
    }
    // Run the notification in the zone so it triggers change detection
    this.#zone.run(() => {
      this.#notificationsStore.addNotification(notification);
    });
    // Allow the default Angular error handler to run
    super.handleError(error);
  }
}

/**
 * Provide the error handler for the application using a custom ErrorService.
 * @description Preferred way to provide Inversion of Control.
 * @returns The providers configured for the error handler
 */
export function provideErrorHandler(): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: ErrorHandler, useClass: ErrorService }]);
}
