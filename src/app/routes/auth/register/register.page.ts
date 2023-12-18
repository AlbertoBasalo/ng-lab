import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { RegisterForm } from './register.form';
import { RegisterStore } from './register.store';
import { Register } from './register.type';

@Component({
  standalone: true,
  imports: [PageTemplate, RegisterForm, RouterLink, ErrorComponent],
  providers: [RegisterStore],
  template: `
    <lab-page [title]="title">
      <lab-register (register)="onRegister($event)" />
      @if (postRegisterError()) {
        <lab-error [error]="postRegisterError()" />
      }
      <a routerLink="/auth/login">Login if you already have an account</a>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  // Injection division
  readonly #store = inject(RegisterStore);

  // data division
  title = 'Register to create your account.';
  postRegisterError = this.#store.postRegisterError;

  // Event handlers division
  onRegister(register: Partial<Register>) {
    this.#store.postRegister(register);
  }
}
