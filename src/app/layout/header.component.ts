import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@shared/auth.store';

@Component({
  selector: 'lab-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <nav>
        <a [routerLink]="homeLink.path">{{ homeLink.label }}</a>
        <ul>
          @if (authStore.isAuthenticated()) {
            @for (link of authLinks; track link.path) {
              <li>
                <a [routerLink]="link.path">{{ link.label }}</a>
              </li>
            }
            <li>{{ userName() }}</li>
          } @else {
            @for (link of anonymLinks; track link.path) {
              <li>
                <a [routerLink]="link.path">{{ link.label }}</a>
              </li>
            }
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
  authStore = inject(AuthStore);
  userName = computed(() => `Hi, ${this.authStore.user().username}`);

  homeLink = { path: 'home', label: 'Home' };
  authLinks = [
    { path: 'activities', label: 'Activities' },
    { path: 'auth/logout', label: 'Logout' },
  ];
  anonymLinks = [{ path: 'auth/register', label: 'Register' }];
}
