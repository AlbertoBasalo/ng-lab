import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthRepository } from '@api/auth.repository';
import { Feedback } from '@domain/feedback.type';
import { Login } from '@domain/login.type';
import { FeedbackComponent } from '@ui/feedback.component';
import { LoginForm } from './login.form';

/**
 * Routed component for the Login page
 * Presents the LoginForm to login
 * Uses the AuthRepository to post the login
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LoginForm, FeedbackComponent],
  template: `
    <article>
      <header>
        <h2>Login</h2>
      </header>
      <main>
        <lab-login (login)="onLogin($event)" />
        <lab-feedback [feedback]="feedback()" />
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

  // * Public signals division

  /** The feedback signal to show messages and status to the user */
  feedback: WritableSignal<Feedback> = signal<Feedback>({ status: 'idle', message: '' });

  // * Event handlers division

  /**
   * Handles the login event from the LoginForm
   * @param {Login} login The login data to post
   */
  onLogin(login: Login) {
    this.feedback.set({ status: 'busy', message: 'Login sent...' });
    this.#authRepository.postLogin$(login).subscribe({
      next: () => this.feedback.set({ status: 'success', message: 'Login ok, enjoy.' }),
      error: () => this.feedback.set({ status: 'error', message: 'Failed to login. Review your data.' }),
    });
  }
}
