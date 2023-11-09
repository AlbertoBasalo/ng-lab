import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <article>
      <header>
        <h2>A demo project made with 🅰️ Angular v 1️⃣7️⃣</h2>
        <p>This is a simple reservation web app with the following features:</p>
      </header>
      <main>
        <ul>
          <li>List of available activities</li>
          <li>Search by text</li>
          <li>View details of any activity</li>
          <li>Register / Login / Logout</li>
          <li>Book a reservation for an activity</li>
          <li>View your bookings</li>
        </ul>
      </main>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPage {}
