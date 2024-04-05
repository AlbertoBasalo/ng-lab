import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@state/auth.store';

/**
 * Guard function to check if the user is authenticated
 * @returns True if the user is authenticated, the URL tree to redirect to the login page otherwise
 */
export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) return true;
  const router = inject(Router);
  return router.createUrlTree(['/auth', 'login']);
};
