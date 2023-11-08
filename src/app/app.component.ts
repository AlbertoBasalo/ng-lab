import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';

@Component({
  selector: 'ab-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent, HeaderComponent],
  template: `
    <ab-header title="🅰️ Angular 1️⃣7️⃣ - Sample" />
    <router-outlet></router-outlet>
    <ab-footer />
  `,
  styles: [],
})
export class AppComponent {}
