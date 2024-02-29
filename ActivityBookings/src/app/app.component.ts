import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './core/footer.component';
import { HeaderWidget } from './core/header.widget';

@Component({
  selector: 'lab-root',
  standalone: true,
  imports: [RouterOutlet, HeaderWidget, FooterComponent],
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
