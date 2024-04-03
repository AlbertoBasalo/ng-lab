import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthRepository } from '@api/auth.repository';
import { Register } from '@domain/register.type';
import { RegisterForm } from './register.form';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RegisterForm],
  template: `
    <article>
      <header>
        <h2>Register</h2>
      </header>
      <main>
        <lab-register (register)="onRegister($event)" />
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

  // * Event handlers division

  /**
   * Handles the register event from the RegisterForm
   * @param {Register} register The register data to post
   */
  onRegister(register: Register) {
    this.authRepository.postRegister$(register).subscribe();
  }
}
