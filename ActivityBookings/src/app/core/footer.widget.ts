import { ChangeDetectionStrategy, Component, WritableSignal, effect, inject, signal } from '@angular/core';
import { LocalRepository } from '@services/local.repository';
import { CookiesComponent } from './cookies.component';

/** Status for cookies user interaction */
type CookiesStatus = 'pending' | 'rejected' | 'essentials' | 'all';

/**
 * Footer component with the author info and cookies acceptance
 */
@Component({
  selector: 'lab-footer',
  standalone: true,
  imports: [CookiesComponent],
  template: `
    <footer>
      <nav>
        <span>
          <a [href]="author.homepage" target="_blank"> © {{ getYear() }} {{ author.name }} </a>
        </span>
        <span data-tooltip="To Do: show error messages">🔥</span>
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
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterWidget {
  localRepository: LocalRepository = inject(LocalRepository);

  // * Properties division

  /** The author info */
  author: { name: string; homepage: string } = {
    name: 'Alberto Basalo',
    homepage: 'https://albertobasalo.dev',
  };

  // * Mutable signals division

  /** Signal with cookies status, initially loaded from local storage*/
  cookiesStatus: WritableSignal<CookiesStatus> = signal<CookiesStatus>(
    this.localRepository.load('cookies', { status: 'pending' }).status as CookiesStatus,
  );

  /** Effect registered as a property, to save the signal state on changes*/
  onCookiesStatusChanged = effect(() => this.localRepository.save('cookies', { status: this.cookiesStatus() }));

  // * Public methods division

  /* Function called from the template (cheap execution) that returns the current year */
  getYear(): number {
    // ! Do not abuse (they are called on every change detection cycle)
    return new Date().getFullYear();
  }

  // ToDo: Add a method to show error messages
}
