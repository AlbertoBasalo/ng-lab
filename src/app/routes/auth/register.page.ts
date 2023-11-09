import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-register',
  standalone: true,
  imports: [CommonModule],
  template: ` <p>register works!</p> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterPage {}
