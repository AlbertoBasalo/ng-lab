import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

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
  // Properties division

  readonly author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  // Mutable signals division

  readonly cookiesAccepted = signal(false);

  // Public methods division

  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  // Event handlers division

  onAcceptClick(): void {
    console.log('Cookies accepted!');
    this.cookiesAccepted.set(true);
  }
}
