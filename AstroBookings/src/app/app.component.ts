import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BookingsComponent } from './bookings/bookings.component';
import { FooterComponent } from './core/layout/footer.component';
import { HeaderComponent } from './core/layout/header.component';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, BookingsComponent],
  template: `
    <lab-header />
    <router-outlet />
    <lab-bookings />
    <lab-footer />
  `,
  styles: [],
})
export class AppComponent {
  title = 'AstroBookings';
}
