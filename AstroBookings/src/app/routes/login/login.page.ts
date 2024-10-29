import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginComponent } from './login.component';

/**
 * Login page component
 */
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginComponent, RouterLink],
  template: `
    <lab-login
      [(username)]="username"
      [(password)]="password"
      (sendLoginDto)="onSendLoginDto()"></lab-login>
    <a routerLink="/register">Don't have an account? Register</a>
  `,
})
export default class LoginPage {
  // Writable signals

  /**
   * Username, default to 'admin'
   */
  readonly username: WritableSignal<string> = signal('admin');
  /**
   * Password, default to 'secret'
   */
  readonly password: WritableSignal<string> = signal('secret');

  // Computed signals

  /**
   * Login DTO, computed from the username and the password
   */
  private readonly loginDto = computed(() => ({
    username: this.username(),
    password: this.password(),
  }));

  // Effects

  /**
   * Effect to log the username and the password
   * - Runs when the username or the password changes
   */
  private readonly changeEffect = effect(() => {
    console.log(this.username(), this.password());
  });

  // Methods (event handlers)

  /**
   * Method to send the login DTO to the API
   */
  onSendLoginDto() {
    console.log('onSendLoginDto', this.loginDto());
  }
}
