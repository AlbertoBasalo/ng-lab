import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthNavigationEffect {
  constructor(private router: Router) {}
  execute(accessToken: string): void {
    if (accessToken) {
      this.router.navigate(['/', 'auth', 'profile']);
    } else {
      this.router.navigate(['/', 'auth', 'login']);
    }
  }
}
