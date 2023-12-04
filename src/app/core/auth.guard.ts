import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';
export const authGuard: CanMatchFn = (route, segments) => {
  const authStore = inject(AuthStore);
  if (authStore.isAuthenticated()) {
    return true;
  }
  const returnUrl = route.path;
  authStore.mustLogin(returnUrl);
  return false;
};
