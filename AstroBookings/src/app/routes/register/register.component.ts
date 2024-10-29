import { JsonPipe } from '@angular/common';
import { Component, computed, model, ModelSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterDto } from './register.page';

/**
 * Register presenter form component
 */
@Component({
  selector: 'lab-register',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <form #registerForm="ngForm">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        name="username"
        #usernameInput="ngModel"
        [(ngModel)]="username"
        required
        minlength="3"
        maxlength="20"
        [attr.aria-invalid]="usernameInput.invalid" />
      @if (usernameInput.errors) {
        <small>{{ usernameInput.errors | json }}</small>
      }
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        #emailInput="ngModel"
        [(ngModel)]="email"
        required
        email
        [attr.aria-invalid]="emailInput.invalid" />
      @if (emailInput.errors) {
        <small>{{ emailInput.errors | json }}</small>
      }
      <label for="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        [(ngModel)]="password"
        #passwordInput="ngModel"
        required
        minlength="4"
        maxlength="20"
        [attr.aria-invalid]="passwordInput.invalid" />
      @if (passwordInput.errors) {
        <small>{{ passwordInput.errors | json }}</small>
      }
      <label for="repeatedPassword">Repeat Password</label>
      <input
        type="password"
        id="repeatedPassword"
        name="repeatedPassword"
        [(ngModel)]="repeatedPassword"
        #repeatedPasswordInput="ngModel"
        required
        [attr.aria-invalid]="areDifferentPasswords()" />
      @if (areDifferentPasswords()) {
        <small>Passwords don't match</small>
      }
      <div class="terms">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          [(ngModel)]="acceptedTerms"
          #termsInput="ngModel"
          required
          [attr.aria-invalid]="termsInput.invalid" />
        <label for="terms">I accept the terms and conditions</label>
        @if (termsInput.errors) {
          <p><small>You must accept the terms</small></p>
        }
      </div>
      <button
        type="submit"
        (click)="onRegisterClick()"
        [disabled]="registerForm.invalid || areDifferentPasswords()">
        Register
      </button>
    </form>
  `,
})
export class RegisterComponent {
  // Model signals (writable input and output)

  /**
   * Username, model signal
   */
  readonly username: ModelSignal<string> = model<string>('');
  /**
   * Email, model signal
   */
  readonly email: ModelSignal<string> = model<string>('');
  /**
   * Password, model signal
   */
  readonly password: ModelSignal<string> = model<string>('');
  /**
   * Repeated password, model signal
   */
  readonly repeatedPassword: ModelSignal<string> = model<string>('');
  /**
   * Accepted terms, model signal
   */
  readonly acceptedTerms: ModelSignal<boolean> = model<boolean>(false);
  /**
   * Send register DTO event, sent to the parent
   */
  readonly sendRegisterDto = output<RegisterDto>();

  // Computed signals

  /**
   * Passwords do not match,
   * - computed signal to validate repeated password
   */
  readonly areDifferentPasswords = computed(() => this.password() !== this.repeatedPassword());

  // Event handler

  /**
   * Register DTO click handler
   * - Emits the register DTO
   */
  onRegisterClick() {
    const registerDto = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
      acceptedTerms: this.acceptedTerms(),
    };
    this.sendRegisterDto.emit(registerDto);
  }
}
