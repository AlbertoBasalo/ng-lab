import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
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
  const router = inject(Router);
  const accessToken = authStore.getUserToken().accessToken;
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return next(clonedRequest).pipe(
    catchError((err) => {
      if (err.status === 401) {
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    }),
  );
}
