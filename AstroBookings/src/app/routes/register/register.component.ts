import { JsonPipe } from '@angular/common';
import { Component, computed, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterDto } from './register.page';

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
        [attr.aria-invalid]="!passwordsMatch()" />
      @if (!passwordsMatch()) {
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
        (click)="sendRegisterDto.emit(registerDto())"
        [disabled]="registerForm.invalid || !passwordsMatch()">
        Register
      </button>
    </form>
  `,
})
export class RegisterComponent {
  readonly username = model<string>('');
  readonly email = model<string>('');
  readonly password = model<string>('');
  readonly repeatedPassword = model<string>('');
  readonly acceptedTerms = model<boolean>(false);
  readonly sendRegisterDto = output<RegisterDto>();

  readonly passwordsMatch = computed(() => this.password() === this.repeatedPassword());

  readonly registerDto = computed<RegisterDto>(() => ({
    username: this.username(),
    email: this.email(),
    password: this.password(),
    acceptedTerms: this.acceptedTerms(),
  }));
}
