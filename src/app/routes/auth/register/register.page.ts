import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { RegisterForm } from './register.form';
import { RegisterPageStore } from './register.page-store';
import { Register } from './register.type';

@Component({
  standalone: true,
  imports: [RegisterForm, RouterLink, ErrorComponent, PageTemplate],
  providers: [RegisterPageStore],
  template: `
    <lab-page [store]="store">
      <lab-register (register)="onRegister($event)" />
      <a routerLink="/auth/login">Login if you already have an account</a>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  // Injection division
  readonly store = inject(RegisterPageStore);

  // Event handlers division
  onRegister(register: Partial<Register>) {
    this.store.postRegister(register);
  }
}
