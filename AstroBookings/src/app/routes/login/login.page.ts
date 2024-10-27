import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { LoginComponent } from './login.component';

export interface LoginDto {
  username: string;
  password: string;
}

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent],
  template: `
    <lab-login
      [(username)]="username"
      [(password)]="password"
      (sendLoginDto)="onSendLoginDto()"></lab-login>
  `,
})
export default class LoginPage {
  readonly username = signal<string>('admin');
  readonly password = signal<string>('secret');
  private readonly loginDto = computed(() => ({
    username: this.username(),
    password: this.password(),
  }));

  private readonly changeEffect = effect(() => {
    console.log(this.username(), this.password());
  });

  onSendLoginDto() {
    console.log('onSendLoginDto', this.loginDto());
  }
}

// ToDo: Forms, validation, etc.
// - Use Template Driven Forms
// - Use ngModel
// - Use container/presenter pattern
// - Use model signal to communicate with the presenter
