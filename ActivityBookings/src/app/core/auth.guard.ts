import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@state/auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    return true;
  }
  const router = inject(Router);
  return router.createUrlTree(['/auth', 'login']);
};
