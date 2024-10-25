import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@layout/footer.component';
import { HeaderComponent } from '@layout/header.component';

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
