import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Notification } from '@domain/notification.type';
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
      <lab-notifications [notifications]="notifications()" (close)="onNotificationsClose()" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidget {
  // * Injected services division

  /** To save and load the Authentication State from the local storage*/
  #localRepository: LocalRepository = inject(LocalRepository);
  /** Store for managing notifications state */
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

  // * Computed properties division

  /** The list of notifications */
  notifications: Signal<Notification[]> = this.#notificationsStore.notifications;
  /** The number of notifications */
  notificationsCount: Signal<number> = this.#notificationsStore.count;
  /** Whether there are notifications */
  hasNotifications: Signal<boolean> = computed(() => this.notificationsCount() > 0);

  /** Effect registered as a property, to save the signal state on changes*/
  onCookiesStatusChanged = effect(() => this.#localRepository.save('cookies', { status: this.cookiesStatus() }));

  // * Public methods division

  /* Function called from the template (cheap execution) that returns the current year */
  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  /** Toggle the show notifications signal */
  toggleNotifications(): void {
    this.showNotification.update((current) => !current);
  }
  /** On close Hide and clear notifications */
  onNotificationsClose(): void {
    this.showNotification.set(false);
    this.#notificationsStore.clearNotifications();
  }
}
