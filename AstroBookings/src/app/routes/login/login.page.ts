import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-login',
  standalone: true,
  imports: [],
  template: ` <p>login works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {}
