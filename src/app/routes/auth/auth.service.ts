import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http$ = inject(HttpClient);
  #apiUrl = 'http://localhost:3000/';

  register$(user: any) {
    const url = `${this.#apiUrl}register`;
    return this.#http$.post(url, user);
  }

  login$(credentials: any) {
    const url = `${this.#apiUrl}login`;
    return this.#http$.post(url, credentials);
  }
}
