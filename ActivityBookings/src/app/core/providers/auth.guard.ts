import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@env/environment';
import { AuthStore } from '@services/state/auth.store';

/**
 * Guard function to check if the user is authenticated.
 * @returns True if the user is authenticated. Otherwise the URL tree to redirect to the login page.
 */
export const authGuard: CanActivateFn = () => {
  if (environment.securityOpen) return true;
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) return true;
  const router = inject(Router);
  return router.createUrlTree(['/auth', 'login']);
};
