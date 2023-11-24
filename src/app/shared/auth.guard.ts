import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    return true;
  }
  const router = inject(Router);
  const urlTree = router.parseUrl('/auth/login');
  return urlTree;
};
