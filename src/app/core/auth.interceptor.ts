import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';
import { Observable, catchError, throwError } from 'rxjs';

/**
 * Interceptor to deal with the authentication
 * @description Adds the authorization header to every request and navigates the user to authenticate if the request fails with a 401
 */
export function AuthInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authStore = inject(AuthStore);
  const accessToken = authStore.accessToken();
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(clonedRequest).pipe(
    catchError((err) => {
      if (err.status === 401) {
        const router = inject(Router);
        const returnUrl = router.url;
        authStore.mustLogin(returnUrl);
      }
      return throwError(() => err);
    }),
  );
}
