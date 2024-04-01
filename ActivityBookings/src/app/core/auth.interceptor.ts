import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { NULL_USER_ACCESS_TOKEN } from '@domain/userAccesToken.type';
import { AuthStore } from '@state/auth.store';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor function to add the Authorization header to the request and handle 401 errors
 * @param req The request to be intercepted
 * @param next The next handler in the chain
 * @returns The observable of HttpEvents to be passed to the next handler
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authStore = inject(AuthStore);
  /** Get access token from AuthStore */
  const accessToken: string = authStore.accessToken();
  /** Add the Authorization header to the request */
  req = req.clone({
    setHeaders: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  });
  /** Use the cloned request and detect auth errors */
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authStore.setState(NULL_USER_ACCESS_TOKEN);
      }
      return throwError(() => error);
    }),
  );
};
