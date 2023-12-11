import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationsStore } from '@shared/services/notifications.store';

@Component({
  selector: 'lab-notifications',
  standalone: true,
  imports: [],
  template: `
    @if (notifications.hasPending()) {
      <dialog open>
        <article>
          <h2>{{ notifications.pending().title }}</h2>
          <p>{{ notifications.pending().message }}</p>
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
  notifications = inject(NotificationsStore);
  close() {
    this.notifications.remove(this.notifications.pending());
  }
  // ToDo: add presentation and logic for question notifications
}
