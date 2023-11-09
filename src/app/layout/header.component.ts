import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header>
      <nav>
        <a routerLink="home">Home</a>
        <ul>
          <li><a routerLink="about">About</a></li>
          <li><a routerLink="auth/register" id="registerLink">Register</a></li>
        </ul>
      </nav>
      <h1>{{ title }}</h1>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
}
