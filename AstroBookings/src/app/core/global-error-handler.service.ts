import { ErrorHandler, Injectable } from '@angular/core';

/**
 * Global error handler service, used to handle errors globally
 * - Must be provided in the app config, instead of the ErrorHandler token
 * @implements ErrorHandler - Angular interface to handle errors globally
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  handleError(error: Error) {
    console.warn(`💥 ${error.message}`);
  }
}
