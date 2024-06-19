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
import { environment } from '@env/environment';
import { LocalRepository } from '@services/local.repository';
import { NotificationsStore } from '@state/notifications.store';
import { NotificationsComponent } from '@ui/notifications.component';
import { CookiesComponent } from './cookies.component';

/** Status for cookies user interaction */
type CookiesStatus = 'pending' | 'rejected' | 'essentials' | 'all';

/**
 * Footer component with the author info and cookies acceptance
 * - Uses the cookies component to manage the cookies status
 * - Uses the notifications component to show the notifications
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
          <button [attr.data-tooltip]="notificationsCount()" (click)="mustShowNotification.set(true)" class="outline">
            🔥
          </button>
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
    @if (mustShowNotification()) {
      <lab-notifications [notifications]="notifications()" (close)="onNotificationsClose()" />
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidget {
  // * Injected services division

  /** To save and load the Cookies State from the local storage*/
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

  /** Signal to indicate if the notifications component must be displayed*/
  mustShowNotification: WritableSignal<boolean> = signal<boolean>(false);

  /** Signal with cookies status, initially loaded from local storage*/
  #localStorageCookiesStatus = this.#localRepository.load('cookies', { status: environment.cookies });
  #initialCookiesStatus: CookiesStatus = this.#localStorageCookiesStatus.status as CookiesStatus;
  cookiesStatus: WritableSignal<CookiesStatus> = signal<CookiesStatus>(this.#initialCookiesStatus);
  /** Effect registered as a property, to save the cookies signal state on changes*/
  onCookiesStatusChanged = effect(() => this.#localRepository.save('cookies', { status: this.cookiesStatus() }));

  // * Computed properties division

  /** The list of notifications */
  notifications: Signal<Notification[]> = this.#notificationsStore.notifications;
  /** The number of notifications */
  notificationsCount: Signal<number> = this.#notificationsStore.count;
  /** Whether there are notifications or not */
  hasNotifications: Signal<boolean> = computed(() => this.notificationsCount() > 0);

  // * Public methods division

  /* Function called from the template (cheap execution) that returns the current year */
  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  /** On close the notifications modal, hide it and clear notifications */
  onNotificationsClose(): void {
    this.mustShowNotification.set(false);
    this.#notificationsStore.clearNotifications();
  }
}
