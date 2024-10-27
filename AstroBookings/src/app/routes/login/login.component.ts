import { JsonPipe } from '@angular/common';
import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  readonly username = model<string>('');
  readonly password = model<string>('');
  readonly sendLoginDto = output<void>();
}
