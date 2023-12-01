import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginForm } from './login.form';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService],
  imports: [RouterLink, LoginForm],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-login (login)="onLogin($event)" />
      <footer>
        <a routerLink="/auth/register">Register if you don't have an account</a>
      </footer>
    </article>
  `,
})
export default class LoginPage {
  #router = inject(Router);
  #service$ = inject(AuthService);
  title = 'Login with your credentials.';
  onLogin(login: Login) {
    this.#service$.login$(login).subscribe({
      next: () => this.#router.navigate(['/']),
      error: () => this.#router.navigate(['/']),
    });
  }
}
