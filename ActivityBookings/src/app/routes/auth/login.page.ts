import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthRepository } from '@api/auth.repository';
import { Login } from '@domain/login.type';
import { LoginForm } from './login.form';

/**
 * Routed component for the Login page
 * Presents the LoginForm to login
 * Uses the AuthRepository to post the login
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoginForm],
  template: `
    <article>
      <header>
        <h2>Login</h2>
      </header>
      <main>
        <lab-login (login)="onLogin($event)" />
      </main>
      <footer>
        <a [routerLink]="['/auth', 'register']">Register if don't have an account</a>
      </footer>
    </article>
  `,
})
export default class LoginPage {
  // * Injected services division

  /** The repository to post the login */
  #authRepository: AuthRepository = inject(AuthRepository);

  // * Event handlers division

  /**
   * Handles the login event from the LoginForm
   * @param {Login} login The login data to post
   */
  onLogin(login: Login) {
    this.#authRepository.postLogin$(login).subscribe();
  }
}
