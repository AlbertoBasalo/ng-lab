import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
      </header>
      <main>
        <h3>{{ section }}</h3>
        <ul>
          @for (feature of featureList; track feature) {
            <li>{{ feature }}</li>
          }
        </ul>
      </main>
    </article>
  `,
})
export default class HomePage {
  title = 'Welcome to the 🅰️ Angular v 1️⃣7️⃣ demo project';
  subtitle = 'This is a simple web app for activity booking';
  section = 'Features:';
  featureList = [
    'List of available activities',
    'Search by text',
    'View details of any activity',
    'Register / Login / Logout',
    'Book a reservation for an activity',
    'View your activities / bookings',
  ];
}
