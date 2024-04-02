import { ChangeDetectionStrategy, Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { LocalRepository } from '@services/local.repository';
import { NotificationsStore } from '@state/notifications.store';
import { NotificationsComponent } from '@ui/notifications.component';
import { CookiesComponent } from './cookies.component';

/** Status for cookies user interaction */
type CookiesStatus = 'pending' | 'rejected' | 'essentials' | 'all';

/**
 * Footer component with the author info and cookies acceptance
 */
@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [CookiesComponent, NotificationsComponent],
  template: `
    <footer>
      <nav>
        <span>
          <a [href]="author.homepage" target="_blank"> © {{ getYear() }} {{ author.name }} </a>
        </span>
        @if (hasNotifications()) {
          <button [attr.data-tooltip]="notificationsCount()" (click)="toggleNotifications()" class="outline">🔥</button>
        }
        <span>
          @switch (cookiesStatus()) {
            @case ('pending') {
              <lab-cookies (cancel)="cookiesStatus.set('rejected')" (accept)="cookiesStatus.set($event)" />
            }
            @case ('rejected') {
              <small data-tooltip="No cookies applied">🍪 ❌</small>
            }
            @case ('essentials') {
              <small data-tooltip="Essential cookies applied">🍪 ✅</small>
            }
            @case ('all') {
              <small data-tooltip="All cookies applied">🍪 ✅ ✅</small>
            }
          }
        </span>
      </nav>
    </footer>
    @if (showNotification()) {
      <lab-notifications [notifications]="notifications()" (close)="onClose()" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidget {
  // * Injected services division

  /** To save and load the Authentication State from the local storage*/
  #localRepository: LocalRepository = inject(LocalRepository);

  #notificationsStore: NotificationsStore = inject(NotificationsStore);

  // * Properties division

  /** The author info */
  author: { name: string; homepage: string } = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  // * Mutable signals division

  showNotification: WritableSignal<boolean> = signal<boolean>(false);

  /** Signal with cookies status, initially loaded from local storage*/
  cookiesStatus: WritableSignal<CookiesStatus> = signal<CookiesStatus>(
    this.#localRepository.load('cookies', { status: 'pending' }).status as CookiesStatus,
  );

  notifications = this.#notificationsStore.notifications;

  hasNotifications = this.#notificationsStore.hasNotifications;

  notificationsCount = this.#notificationsStore.count;

  /** Effect registered as a property, to save the signal state on changes*/
  onCookiesStatusChanged = effect(() => this.#localRepository.save('cookies', { status: this.cookiesStatus() }));

  // * Public methods division

  /* Function called from the template (cheap execution) that returns the current year */
  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  /** Function called from the template to show the notifications */
  toggleNotifications(): void {
    this.showNotification.update((current) => !current);
  }

  onClose(): void {
    this.showNotification.set(false);
    this.#notificationsStore.clearNotifications();
  }
}
