import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProcess } from './auth.store';

/**
 * Effect to navigate to the appropriate page based on the current authentication state
 */
@Injectable({ providedIn: 'root' })
export class AuthNavigationEffect {
  #router = inject(Router);

  /**
   * Navigate to the appropriate page based on the current authentication process state
   * @param authProcess current authentication process state
   */
  navigate(authProcess: AuthProcess): void {
    if (!authProcess.interactive) return;
    if (authProcess.mustLogin) {
      this.#router.navigate(['/', 'auth', 'login']);
      return;
    }
    if (authProcess.url) {
      this.#router.navigateByUrl(authProcess.url);
    } else {
      this.#router.navigate(['/', 'auth', 'profile']);
    }
  }
}
