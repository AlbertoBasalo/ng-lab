import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

/**
 * Footer component with the author info and cookies acceptance
 */
@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <span>
          <a [href]="author.homepage" target="_blank"> © {{ getYear() }} {{ author.name }} </a>
        </span>
        <span>
          @if (cookiesAccepted()) {
            <small>🍪 ✅</small>
          } @else {
            <button (click)="onAcceptClick()" class="secondary outline">Accept Cookies</button>
          }
        </span>
      </nav>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  // * Properties division

  /** The author info */
  author: { name: string; homepage: string } = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  // * Mutable signals division

  /** Signal flag true when user has accepted cookies*/
  cookiesAccepted = signal(false);

  // * Public methods division

  /* Function called from the template (cheap execution) that returns the current year */
  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  // * Event handlers division

  /** Event handler for click event the accept cookies button */
  onAcceptClick(): void {
    console.log('Cookies accepted!');
    this.cookiesAccepted.set(true);
  }
}
