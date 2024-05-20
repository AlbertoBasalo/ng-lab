import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterWidget } from './core/footer.widget';
import { HeaderWidget } from './core/header.widget';
/**
 * Root component of the application with the main layout.
 * - Contains the header, the main content and the footer.
 * - Uses the router outlet to display the different pages.
 */
@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, HeaderWidget, FooterWidget],
  template: `
    <div class="container-fluid">
      <lab-header />
      <main>
        <router-outlet />
      </main>
      <lab-footer />
    </div>
  `,
  styles: [
    `
      main {
        margin-top: 2rem;
        margin-bottom: 2rem;
      }
    `,
  ],
})
export class AppComponent {}
