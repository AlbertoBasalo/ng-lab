import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthStore } from '../shared/services/auth.store';

export const authGuard: CanMatchFn = (route, segments) => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    return true;
  }
  const router = inject(Router);
  const urlTree = router.parseUrl('/auth/login');
  return urlTree;
};
