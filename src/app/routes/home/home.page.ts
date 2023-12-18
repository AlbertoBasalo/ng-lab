import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageTemplate } from '@shared/ui/page.template';

@Component({
  standalone: true,
  imports: [PageTemplate],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lab-page [title]="title">
      <p class="subtitle">{{ subtitle }}</p>
      <h3>{{ section }}</h3>
      <ul>
        @for (feature of featureList; track feature) {
          <li>{{ feature }}</li>
        }
      </ul>
    </lab-page>
  `,
})
export default class HomePage {
  // Data division
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
