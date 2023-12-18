import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationsStore } from '@shared/services/notifications.store';

@Component({
  selector: 'lab-notifications',
  standalone: true,
  template: `
    @if (hasNext()) {
      <dialog open>
        <article>
          <h2>{{ next().title }}</h2>
          <p>{{ next().message }}</p>
          <footer>
            <button (click)="close()" class="secondary outline">OK</button>
          </footer>
        </article>
      </dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  // Injection division
  readonly #notifications = inject(NotificationsStore);

  // Data division
  hasNext = this.#notifications.hasNext;
  next = this.#notifications.next;

  // Event division
  close() {
    this.#notifications.remove(this.#notifications.next());
  }
  // ToDo: add presentation and logic for question notifications
}
