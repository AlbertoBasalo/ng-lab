import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandlerService implements ErrorHandler {
  handleError(error: Error) {
    console.warn(`💥 ${error.message}`);
  }
}
