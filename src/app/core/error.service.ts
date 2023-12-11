import { ErrorHandler, inject } from '@angular/core';
import { LogLevel, LogService } from '../shared/services/log.service';

class ErrorService implements ErrorHandler {
  #log = inject(LogService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any) {
    this.#log.log({
      level: LogLevel.error,
      message: error.message,
      source: '🪖 Error Service Handler',
      payload: error,
    });
    // ToDo: use dialog service
    // this.#window.displayAlert({
    //   title: 'Application Failed',
    //   message: 'We will work on it, please try again later.',
    // });
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
