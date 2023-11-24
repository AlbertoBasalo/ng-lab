import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    console.log('Authenticated', authStore.user());
    return true;
  }
  console.log('Not authenticated', state.url);
  // Create an UrlTree to redirect the user to the login page
  const router = inject(Router);
  const urlTree = router.parseUrl('/auth/login');
  return urlTree;
};
