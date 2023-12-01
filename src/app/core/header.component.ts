import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@shared/services/auth.store';

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
            @for (link of authLinks(); track link.path) {
              <li>
                <a [routerLink]="link.path">{{ link.label }}</a>
              </li>
            }
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

  homeLink = { path: 'home', label: 'Home' };
  authLinks = computed(() => {
    const userName = this.authStore.user().username?.split(' ')[0] || '?';
    return [
      { path: 'activities', label: 'Activities' },
      { path: 'activities/new', label: 'New Activity' },
      { path: 'auth/profile', label: userName },
    ];
  });
  anonymLinks = [
    { path: 'activities', label: 'Activities' },
    { path: 'auth/login', label: 'Login' },
  ];
}
