import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Header widget component
 * - Displays the header with the title and the menu
 * - It is a smart component that owns its data
 */
@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <a routerLink="">
          <b>{{ title }}</b>
        </a>
        <section>
          @for (item of menu; track item.link) {
            @if (!item.registeredOnly || isAuthenticated) {
              <span>
                <a [routerLink]="item.link">{{ item.title }}</a>
              </span>
            }
          }
        </section>
      </nav>
    </header>
  `,
})
export class HeaderWidget {
  title = '🚀 Astro Bookings';
  isAuthenticated = false;
  menu = [
    {
      title: '🌍 Home',
      link: '/',
    },
    {
      title: '🎟️ Bookings',
      link: '/bookings',
      registeredOnly: true,
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
