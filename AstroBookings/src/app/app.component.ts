import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterWidget } from '@layout/footer.widget';
import { HeaderWidget } from '@layout/header.widget';

/**
 * Root component
 * - Displays the header, the router outlet and the footer
 */
@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, HeaderWidget, FooterWidget],
  template: `
    <lab-header />
    <router-outlet />
    <lab-footer />
  `,
})
export class AppComponent {}
