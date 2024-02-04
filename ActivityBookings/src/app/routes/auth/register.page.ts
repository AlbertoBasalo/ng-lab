import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <article>
      <header>
        <h2>Register</h2>
      </header>
      <main>
        <form>
          <label for="username">
            <span>Username</span>
            <input id="username" type="text" />
          </label>
          <label for="email">
            <span>Email</span>
            <input id="email" type="email" />
          </label>
          <label for="password">
            <span>Password</span>
            <input id="password" type="password" />
          </label>
          <label for="confirm">
            <span>Confirm Password</span>
            <input id="confirm" type="password" />
          </label>
          <label for="terms">
            <span>Accept the terms and conditions</span>
            <input id="terms" type="checkbox" />
          </label>
          <button type="submit">Login</button>
        </form>
      </main>
      <footer>
        <a [routerLink]="['/auth', 'login']">Login if already have an account</a>
      </footer>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {}
