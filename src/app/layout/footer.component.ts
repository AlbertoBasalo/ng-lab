import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <nav>
        <section>
          <a [href]="author.homepage" target="_blank" class="secondary">
            © {{ year }} {{ author.name }}
          </a>
        </section>
        <section>
          <a [href]="solution.repository" target="_blank" class="secondary">
            <u>{{ solution.name }}</u>
          </a>
        </section>
      </nav>
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };
  solution = {
    name: 'Angular 17 - Lab sample',
    repository: 'https://github.com/AlbertoBasalo/ng-lab',
  };
  year = new Date().getFullYear();
}
