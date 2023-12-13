import { ChangeDetectionStrategy, Component, Injector, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NULL_USER_TOKEN, UserToken } from '@shared/domain/user-token.type';
import { connect } from '@shared/services/command.signal';
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
    <lab-page [title]="title" [status]="status">
      <lab-register (register)="onRegister($event)" />
      <a routerLink="/auth/login">Login if you already have an account</a>
    </lab-page>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {
  #service$ = inject(AuthService);
  #store = inject(PageStore);
  #injector = inject(Injector);
  title = 'Register to create your account.';
  error = signal<string>('');
  status = this.#store.commandStatus;
  #postRegister = this.#store.createSignal<UserToken>(NULL_USER_TOKEN);

  onRegister(register: Partial<Register>) {
    const source$ = this.#service$.register$(register);
    connect(source$, this.#postRegister, this.#injector);
  }
}
