import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Footer widget component
 * - Displays the footer with the author and the year
 * - It is a smart component that owns its data
 */
@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <a [href]="author.homepage" target="_blank">© {{ year }} {{ author.name }}</a>
        <button (click)="onAcceptClick()">Accept Cookies</button>
      </nav>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidget {
  author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  year = new Date().getFullYear();

  /**
   * Event handler for the accept cookies button
   */
  onAcceptClick() {
    console.log('Cookies accepted!');
  }
}
