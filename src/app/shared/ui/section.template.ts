import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'lab-section',
  standalone: true,
  imports: [],
  template: `
    <article>
      <header>
        <h3>{{ title }}</h3>
        @if (subtitle) {
          <p>{{ subtitle }}</p>
        }
      </header>
      <main>
        <ng-content></ng-content>
      </main>
      <footer>
        <ng-content select="footer"></ng-content>
      </footer>
    </article>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTemplate {
  @Input() title = '';
  @Input() subtitle = '';
}
