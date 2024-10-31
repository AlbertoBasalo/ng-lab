import { Injectable } from '@angular/core';
import { LoginDto } from './login.dto';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  login(loginDto: LoginDto): boolean {
    console.log('Service login:', loginDto);
    return true;
  }
}
