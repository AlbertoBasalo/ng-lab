import { JsonPipe } from '@angular/common';
import { Component, computed, model, ModelSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlBlock } from '@ui/control.block';
import { ValidPasswordDirective } from '@ui/valid-password.directive';
import { RegisterDto } from './register.dto';

/**
 * Register presenter form component
 */
@Component({
  selector: 'lab-register',
  standalone: true,
  imports: [FormsModule, JsonPipe, ValidPasswordDirective, ControlBlock],
  template: `
    <form #form="ngForm">
      <fieldset>
        <lab-control label="User name" [control]="usernameInput">
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
        </lab-control>
        <lab-control [control]="emailInput">
          <input
            type="email"
            id="email"
            name="email"
            #emailInput="ngModel"
            [(ngModel)]="email"
            required
            email
            minlength="3"
            maxlength="20"
            [attr.aria-invalid]="emailInput.invalid" />
        </lab-control>
        <lab-control [control]="passwordInput">
          <input
            type="password"
            id="password"
            name="password"
            [(ngModel)]="password"
            #passwordInput="ngModel"
            required
            minlength="4"
            maxlength="20"
            labValidPassword
            [attr.aria-invalid]="passwordInput.invalid" />
        </lab-control>
        <lab-control label="Repeat Password" [control]="repeatPasswordInput">
          <input
            type="password"
            id="repeatPassword"
            name="repeatPassword"
            [(ngModel)]="repeatedPassword"
            #repeatPasswordInput="ngModel"
            [attr.aria-invalid]="areDifferentPasswords()" />
          @if (areDifferentPasswords()) {
            <small>Passwords are different</small>
          }
        </lab-control>
      </fieldset>
      <button
        type="submit"
        (click)="onRegisterClick()"
        [disabled]="form.invalid || areDifferentPasswords()">
        Register
      </button>
    </form>
    <pre>{{ form.value | json }}</pre>
    <pre>Password checked {{ times }} times</pre>
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

  public times = 0;

  // public areDifferentPasswords() {
  //   this.times++;
  //   return this.password !== this.repeatPassword;
  // }

  /**
   * Passwords do not match,
   * - computed signal to validate repeated password
   */
  public areDifferentPasswords = computed(() => {
    this.times++;
    return this.password() !== this.repeatedPassword();
  });

  // readonly areDifferentPasswords = computed(() => this.password() !== this.repeatedPassword());

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
