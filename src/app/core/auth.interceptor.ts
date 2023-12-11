import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';
import { NotificationsStore } from '@shared/services/notifications.store';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Interceptor to deal with the authentication
 * @description Adds the authorization header and notifies if the request fails with a 401
 */
export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authStore = inject(AuthStore);
  const notificationsStore = inject(NotificationsStore);
  const router = inject(Router);
  const accessToken = authStore.accessToken();
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(clonedRequest).pipe(
    catchError((err) => {
      if (err.status === 401) {
        notificationsStore.showFailure({
          title: 'Authentication Failed',
          message: 'Please login to continue.',
        });
        const returnUrl = router.url;
        authStore.mustLogin(returnUrl);
      }
      return throwError(() => err);
    }),
  );
}
