import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor to ensure a common base for all the requests
 * @description clones the request and prepends the base url
 */
export function BaseInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const baseUrl = 'http://localhost:3000'; // ToDo: move to environment
  const url = `${baseUrl}/${req.url}`;
  const clonedRequest = req.clone({ url });
  return next(clonedRequest);
}
