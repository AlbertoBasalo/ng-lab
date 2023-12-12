import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { AuthService } from '../auth.service';
import { LoginForm } from './login.form';
import { Login } from './login.type';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AuthService],
  imports: [PageTemplate, RouterLink, LoginForm, ErrorComponent],
  template: `
    <lab-page [title]="title">
      <lab-login (login)="onLogin($event)" />
      <footer>
        @if (error()) {
          <lab-error [error]="error()" />
        }
        <a routerLink="/auth/register">Register if you don't have an account</a>
      </footer>
    </lab-page>
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
