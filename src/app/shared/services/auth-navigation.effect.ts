import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from './auth.store';

/**
 * Effect to navigate to the appropriate page based on the current authentication state
 */
@Injectable({ providedIn: 'root' })
export class AuthNavigationEffect {
  #router = inject(Router);

  /**
   * Navigate to the appropriate page based on the current authentication state
   * @param authState current authentication state
   */
  navigate(authState: AuthState): void {
    if (!authState.authProcess.interactive) return;
    if (authState.authProcess.mustLogin) {
      this.#router.navigate(['/', 'auth', 'login']);
      return;
    }
    if (authState.authProcess.url) {
      this.#router.navigateByUrl(authState.authProcess.url);
    } else {
      this.#router.navigate(['/', 'auth', 'profile']);
    }
  }
}
