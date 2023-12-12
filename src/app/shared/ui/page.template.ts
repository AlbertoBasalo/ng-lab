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
      <ng-content></ng-content>
      <footer>
        <ng-content select="footer"></ng-content>
      </footer>
    </article>
  `,
})
export class PageTemplate {
  @Input() title = '';
  @Input() subtitle = '';
  // ToDo: status (loading, error...) signal for the page footer
}
