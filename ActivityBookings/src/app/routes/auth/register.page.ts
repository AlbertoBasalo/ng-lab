import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthRepository } from '@api/auth.repository';
import { Feedback } from '@domain/feedback.type';
import { Register } from '@domain/register.type';
import { FeedbackComponent } from '@ui/feedback.component';
import { RegisterForm } from './register.form';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RegisterForm, FeedbackComponent],
  template: `
    <article>
      <header>
        <h2>Register</h2>
      </header>
      <main>
        <lab-register (register)="onRegister($event)" />
        <lab-feedback [feedback]="feedback()" />
      </main>
      <footer>
        <a [routerLink]="['/auth', 'login']">Login if already have an account</a>
      </footer>
    </article>
  `,
})
export default class RegisterPage {
  // * Injected services division

  /** The repository to post the login */
  authRepository: AuthRepository = inject(AuthRepository);

  // * Public signals division

  /** The feedback signal to show messages and status to the user */
  feedback: WritableSignal<Feedback> = signal<Feedback>({ status: 'idle', message: '' });

  // * Event handlers division

  /**
   * Handles the register event from the RegisterForm
   * @param {Register} register The register data to post
   */
  onRegister(register: Register) {
    this.feedback.set({ status: 'busy', message: 'Registering...' });
    this.authRepository.postRegister$(register).subscribe({
      next: () => this.feedback.set({ status: 'success', message: 'Register ok, thanks for join.' }),
      error: () => this.feedback.set({ status: 'error', message: 'Failed to register. Review your data.' }),
    });
  }
}
