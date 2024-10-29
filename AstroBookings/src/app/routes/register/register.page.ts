import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from './register.component';
import { RegisterDto } from './register.dto';

/**
 * Register page component
 */
@Component({
  standalone: true,
  imports: [RegisterComponent, JsonPipe],
  template: `
    <h2>Register</h2>
    <lab-register (sendRegisterDto)="onRegister($event)" />
    <a routerLink="/login">Already have an account? Login</a>
  `,
})
export default class RegisterPage {
  // Event handler

  /**
   * Register event handler, sent from the presenter
   * @param registerDto - Register DTO from the presenter form
   */
  onRegister(registerDto: RegisterDto) {
    console.log('Register submitted', registerDto);
  }
}
