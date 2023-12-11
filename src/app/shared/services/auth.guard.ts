import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';

/**
 * Allow only authenticated users to access the route.
 * @param route The route to check.
 * @param segments
 * @returns True if the user is authenticated, false otherwise.
 */
export const authGuard: CanMatchFn = (route, segments) => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) return true;
  const returnUrl = route.path;
  authStore.mustLogin(returnUrl);
  return false;
};
