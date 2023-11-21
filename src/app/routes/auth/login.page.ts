import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { LoginForm } from './login.form';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LoginForm],
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
export class LoginPage {
  #service$ = inject(AuthService);
  title = 'Login with your credentials.';
  onLogin(event: any) {
    this.#service$.login$(event).subscribe((response) => {
      console.log(response);
    });
  }
}
