import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RegisterComponent } from './register.component';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

@Component({
  standalone: true,
  imports: [RegisterComponent, JsonPipe],
  template: `
    <h2>Register</h2>
    <lab-register (sendRegisterDto)="onRegister($event)" />
    @if (lastRegisterDto) {
      <pre>{{ lastRegisterDto | json }}</pre>
    }
  `,
})
export default class RegisterPage {
  lastRegisterDto: RegisterDto | null = null;

  onRegister(registerDto: RegisterDto) {
    console.log('Register submitted', registerDto);
    this.lastRegisterDto = registerDto;
  }
}
