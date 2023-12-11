import { ErrorHandler, inject } from '@angular/core';
import { NotificationsStore } from '@shared/services/notifications.store';
import { LogLevel, LogService } from '../shared/services/log.service';

class ErrorService implements ErrorHandler {
  #log = inject(LogService);
  #notifications = inject(NotificationsStore);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any) {
    this.#log.log({
      level: LogLevel.error,
      message: error.message,
      source: '🪖 Error Service Handler',
      payload: error,
    });
    this.#notifications.showFailure({
      title: 'Application Failed',
      message: 'We will work on it, please try again later.',
    });
  }
}

/**
 * Provides a class to handle errors
 * @description this is a factory function
 * @see ErrorService
 */
export const provideErrorHandler = () => {
  return {
    provide: ErrorHandler,
    useClass: ErrorService,
  };
};
