import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer.component';

@Component({
  selector: 'ab-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    <router-outlet></router-outlet>
    <ab-footer />
  `,
  styles: [],
})
export class AppComponent {
  title = 'AlbertoBasalo/ng17';
}
