import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthRepository } from '@api/auth.repository';
import { Login } from '@domain/login.type';
import { LoginForm } from './login.form';

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
  authRepository: AuthRepository = inject(AuthRepository);
  onLogin(login: Login) {
    this.authRepository.postLogin$(login).subscribe((userAccessToken) => {
      console.log('UserAccessToken', userAccessToken);
    });
  }
}
