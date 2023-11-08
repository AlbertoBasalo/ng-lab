import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ab-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer>
      <nav>
        <div>
          <a [href]="author.homepage" target="_blank"
            >© {{ year }} {{ author.name }}</a
          >
        </div>
        <div>
          <a [href]="solution.repository" target="_blank" class="secondary">
            <u>{{ solution.name }}</u>
          </a>
        </div>
      </nav>
    </footer>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  author = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };
  solution = {
    name: '🅰️ Angular 1️⃣7️⃣ - Sample',
    repository: 'https://github.com/AlbertoBasalo/ng17',
  };
  year = new Date().getFullYear();
}
