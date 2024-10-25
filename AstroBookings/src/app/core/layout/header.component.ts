import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [],
  template: `
    <header>
      <nav>
        <a href="">{{ title }}</a>
        <section>
          @for (item of menu; track item.link) {
            <span>
              <a [href]="item.link">{{ item.title }}</a>
            </span>
          }
        </section>
      </nav>
    </header>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  title = 'Astro Bookings';
  menu = [
    {
      title: '🌍 Home',
      link: '/',
    },
    {
      title: '🎟️ Bookings',
      link: '/launches/:id/bookings',
    },
    {
      title: '📘 About us',
      link: '/about',
    },
    {
      title: '🔐 Log In',
      link: '/login',
    },
  ];
}
