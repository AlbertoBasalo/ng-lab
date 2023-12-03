import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { AuthService } from '../auth.service';
import { LoginForm } from './login.form';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService],
  imports: [RouterLink, LoginForm, ErrorComponent],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-login (login)="onLogin($event)" />
      @if (error()) {
        <lab-error [message]="error()" />
      }
      <footer>
        <a routerLink="/auth/register">Register if you don't have an account</a>
      </footer>
    </article>
  `,
})
export default class LoginPage {
  #service$ = inject(AuthService);
  title = 'Login with your credentials.';
  error = signal<string>('');
  onLogin(login: Login) {
    this.#service$.login$(login).subscribe({
      error: (httpError) => this.error.set(httpError.error),
    });
  }
}
