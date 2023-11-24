import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler } from '@angular/core';
import { displayAlert } from '@shared/window.utils';

/**
 * Log any non handled error and alert user
 */
export class ErrorService implements ErrorHandler {
  // #window = inject(WindowService);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      console.warn(error.message, error, '👮🏼‍♀️ Error Service Handler');
    } else {
      console.error(error, '🪖 Error Service Handler');
      displayAlert({
        title: 'Application Failed',
        message: 'We will work on it, please try again later.',
      });
    }
  }
}
