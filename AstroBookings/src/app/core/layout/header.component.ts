import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [],
  template: `
    <header>
      <nav>
        <a href="">{{ title }}</a>
      </nav>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  title = 'Astro Bookings';
}
