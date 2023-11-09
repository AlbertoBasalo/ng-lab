import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <hr />
    <footer>
      <nav>
        <section>
          <a [href]="author.homepage" target="_blank" class="secondary"
            >© {{ year }} {{ author.name }}</a
          >
        </section>
        <section>
          <a [href]="solution.repository" target="_blank" class="secondary">
            <u>{{ solution.name }}</u>
          </a>
        </section>
      </nav>
    </footer>
  `,
  styles: `
    .secondary {
      color: var(--color-secondary);
      font-size: 0.8rem;
      font-weight: 400;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };
  solution = {
    name: 'Angular 17 - Lab Sample',
    repository: 'https://github.com/AlbertoBasalo/ng-lab',
  };
  year = new Date().getFullYear();
}
