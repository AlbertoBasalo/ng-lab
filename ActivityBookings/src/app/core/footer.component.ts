import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [],
  template: `
    <footer>
      <nav>
        <span>
          <a [href]="author.homepage" target="_blank"> © {{ year }} {{ author.name }} </a>
        </span>
        <span>
          @if (cookiesAccepted()) {
            <small>🍪</small>
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
  readonly author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  readonly year = new Date().getFullYear();

  readonly cookiesAccepted = signal(false);

  onAcceptClick() {
    console.log('Cookies accepted!');
    this.cookiesAccepted.set(true);
  }
}
