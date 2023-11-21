import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <lab-header [title]="appTitle" />
    <router-outlet></router-outlet>
    <lab-footer />
  `,
  styles: [],
})
export class AppComponent {
  appTitle = 'Activity Bookings';
}
