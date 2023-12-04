import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from './auth.store';

@Injectable({ providedIn: 'root' })
export class NavigationEffect {
  constructor(private router: Router) {}
  navigate(authState: AuthState): void {
    if (!authState.authProcess.interactive) return;
    if (authState.authProcess.mustLogin) {
      this.router.navigate(['/', 'auth', 'login']);
      return;
    }
    if (authState.authProcess.url) {
      this.router.navigateByUrl(authState.authProcess.url);
    } else {
      this.router.navigate(['/', 'auth', 'profile']);
    }
  }
}
