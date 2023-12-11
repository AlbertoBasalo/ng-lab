import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { APP_CONFIG } from '../shared/services/app-config.provider';
import { LogLevel, LogService } from '../shared/services/log.service';

/**
 * Interceptor to ensure a common base for all the requests
 * @description prepends the base url and logs the errors
 */
export function BaseInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const appConfig = inject(APP_CONFIG);
  const logger = inject(LogService);
  const url = `${appConfig.apiBaseUrl}/${req.url}`;
  const clonedRequest = req.clone({ url });
  return next(clonedRequest).pipe(
    catchError((err) => {
      logger.log({
        level: LogLevel.warn,
        message: err.error || err.message,
        source: '👮🏼‍♀️ Base Interceptor',
        payload: err,
      });
      return throwError(() => err);
    }),
  );
}
