import { ChangeDetectionStrategy, Component, Injector, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connectSignal } from '@shared/services/command.signal';
import { PageStore } from '@shared/services/page.store';
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
    <lab-page [store]="store">
      <lab-register (register)="onRegister($event)" />
      <a routerLink="/auth/login">Login if you already have an account</a>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  // Injection division
  readonly #injector = inject(Injector);
  readonly #service$ = inject(AuthService);
  readonly store = inject(PageStore);

  // Data division
  #postRegister = this.store.addNewStatusSignal<UserToken>(NULL_USER_TOKEN);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Register to create your account.');
  }

  // Event handlers division
  onRegister(register: Partial<Register>) {
    const source$ = this.#service$.register$(register);
    connectSignal(source$, this.#postRegister, this.#injector);
  }
}
