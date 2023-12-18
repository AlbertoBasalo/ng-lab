import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageTemplate } from '@shared/ui/page.template';
import { RegisterForm } from './register.form';
import { RegisterStore } from './register.store';
import { Register } from './register.type';

@Component({
  standalone: true,
  imports: [PageTemplate, RegisterForm, RouterLink],
  providers: [RegisterStore],
  template: `
    <lab-page [title]="title">
      <lab-register (register)="onRegister($event)" />
      <a routerLink="/auth/login">Login if you already have an account</a>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  // Injection division
  readonly store = inject(RegisterStore);

  // data division
  title = 'Register to create your account.';

  // Event handlers division
  onRegister(register: Partial<Register>) {
    this.store.postRegister(register);
  }
}
