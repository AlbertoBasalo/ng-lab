import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthStore } from '@shared/auth.store';
import { Router } from 'express';

@Component({
  selector: 'lab-logout',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>Logout, bye!</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogoutPage {
  #authStore = inject(AuthStore);
  #router = inject(Router);
  constructor() {
    this.#authStore.clearUserToken();
    this.#router.navigate(['/']);
  }
}
