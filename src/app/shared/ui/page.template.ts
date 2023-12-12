import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
        @if (subtitle) {
          <p>{{ subtitle }}</p>
        }
      </header>
      <main>
        <ng-content select="main"></ng-content>
      </main>
      <footer>
        <ng-content select="footer"></ng-content>
      </footer>
    </article>
  `,
})
export class PageTemplate {
  @Input() title = '';
  @Input() subtitle = '';
}
