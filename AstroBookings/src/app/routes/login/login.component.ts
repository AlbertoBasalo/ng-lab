import { JsonPipe } from '@angular/common';
import { Component, model, ModelSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

/**
 * Presenter form component
 */
@Component({
  selector: 'lab-login',
  standalone: true,
  imports: [FormsModule, JsonPipe],
  template: `
    <form #loginForm="ngForm">
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
      <button type="submit" (click)="sendLoginDto.emit()" [disabled]="loginForm.invalid">
        Login
      </button>
    </form>
  `,
})
export class LoginComponent {
  // Model signals (writable input and output)

  /**
   * Username, model signal
   * - Comes from the parent
   * - Bound to the input field
   * - Sends to the parent
   */
  readonly username: ModelSignal<string> = model<string>('');
  /**
   * Password, model signal
   * - Comes from the parent
   * - Bound to the input field
   * - Sends to the parent
   */
  readonly password: ModelSignal<string> = model<string>('');

  // Output event (sent to parent)

  /**
   * Send login DTO event, sent to the parent
   * - Currently send no value
   * - The value is at the model properties
   * - Can be rewritten to send a computed DTO
   */
  readonly sendLoginDto = output<void>();
}

// Forms, validation, etc.
// - Use Template Driven Forms
// - Use ngModel
// - Use container/presenter pattern
// - Use model signal to communicate with the presenter
