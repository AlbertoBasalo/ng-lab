import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <a [routerLink]="homeLink.path">{{ homeLink.label }}</a>
        <ul>
          @for (link of appLinks; track link.path) {
            <li>
              <a [routerLink]="link.path">{{ link.label }}</a>
            </li>
          }
        </ul>
      </nav>
      <h1>{{ title }}</h1>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input({ required: true }) title!: string;
  homeLink = { path: 'home', label: 'Home' };
  appLinks = [
    { path: 'activities', label: 'Activities' },
    { path: 'auth/register', label: 'Register' },
  ];
}
