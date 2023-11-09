import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RegisterForm } from './register.form';

@Component({
  standalone: true,
  imports: [CommonModule, RegisterForm],
  template: `
    <article>
      <header>
        <h2>Register</h2>
      </header>
      <main>
        <lab-register />
      </main>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {}
