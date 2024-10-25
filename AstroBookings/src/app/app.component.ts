import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/layout/footer.component';
import { HeaderComponent } from './core/layout/header.component';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <lab-header />
    <router-outlet />
    <lab-footer />
  `,
  styles: [],
})
export class AppComponent {
  title = 'AstroBookings';
}

// ToDo:
// - Use router outlet and remove the bookings component
// - Have a home page with a list of launches
// - Link the launch to the bookings page for the selected launch
// - Add Registration and Login pages
