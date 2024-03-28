import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterWidget } from './core/footer.widget';
import { HeaderWidget } from './core/header.widget';
/**
 * Root component of the application with the main layout
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
})
export class AppComponent {}
