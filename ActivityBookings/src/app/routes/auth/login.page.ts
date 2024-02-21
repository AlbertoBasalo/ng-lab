import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lab-login',
  standalone: true,
  imports: [RouterLink],
  template: `
    <article>
      <header>
        <h2>Login</h2>
      </header>
      <main>
        <form>
          <label for="email">
            <span>Email</span>
            <input id="email" type="email" />
          </label>
          <label for="password">
            <span>Password</span>
            <input id="password" type="password" />
          </label>
          <button type="submit">Login</button>
        </form>
      </main>
      <footer>
        <a [routerLink]="['/auth', 'register']">Register if don't have an account</a>
      </footer>
    </article>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {}
