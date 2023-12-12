import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { AuthService } from '../auth.service';
import { RegisterForm } from './register.form';
import { Register } from './register.type';

@Component({
  standalone: true,
  imports: [RegisterForm, RouterLink, ErrorComponent, PageTemplate],
  providers: [AuthService],
  template: `
    <lab-page [title]="title">
      <main>
        <lab-register (register)="onRegister($event)" />
      </main>
      <footer>
        @if (error()) {
          <lab-error [message]="error()" />
        }
        <a routerLink="/auth/login">Login if you already have an account</a>
      </footer>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  #service$ = inject(AuthService);
  title = 'Register to create your account.';
  error = signal<string>('');

  onRegister(register: Partial<Register>) {
    this.#service$.register$(register).subscribe({
      error: (httpError) => this.error.set(httpError.error),
    });
  }
}
