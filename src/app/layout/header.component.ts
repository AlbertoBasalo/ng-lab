import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ab-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header>
      <nav>
        <a routerLink="home">Home</a>
        <a routerLink="about">About</a>
      </nav>
      <h1>Welcome to {{ title }}!</h1>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
}
