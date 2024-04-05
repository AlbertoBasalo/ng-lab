import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NULL_USER_ACCESS_TOKEN } from '@domain/userAccessToken.type';
import { AuthStore } from '@state/auth.store';
import { NotificationsStore } from '@state/notifications.store';
import { catchError, throwError } from 'rxjs';
/**
 * Interceptor function to add the Authorization header to the request and handle 401 errors
 * @param req The request to be intercepted
 * @param next The next handler in the chain
 * @returns The observable of HttpEvents to be passed to the next handler
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // * Injects division

  /** The Auth Store to get the access token */
  const authStore: AuthStore = inject(AuthStore);
  /** The Notifications Store to add error notifications */
  const notificationsStore: NotificationsStore = inject(NotificationsStore);
  /** The Router to navigate to the login page */
  const router: Router = inject(Router);

  /** Get access token from AuthStore */
  const accessToken: string = authStore.accessToken();
  /** Create and Add the Authorization header to the request */
  const authorizationHeader: string = accessToken ? `Bearer ${accessToken}` : '';
  req = req.clone({
    setHeaders: {
      Authorization: authorizationHeader,
    },
  });
  /** Send the cloned request and get into the pipeline of events to catch errors */
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authStore.setState(NULL_USER_ACCESS_TOKEN);
        router.navigate(['/auth', 'login']);
      }
      notificationsStore.addNotification({ message: error.message, type: 'error' });
      return throwError(() => error);
    }),
  );
};
