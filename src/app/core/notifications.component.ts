import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationsStore } from '@shared/services/notifications.store';

@Component({
  selector: 'lab-notifications',
  standalone: true,
  imports: [],
  template: `
    @if (notifications.pending()) {
      <dialog open>
        <article>
          <h2>{{ notifications.pending().title }}</h2>
          <p>{{ notifications.pending().message }}</p>
          <footer>
            <button (click)="notifications.removePending()">OK</button>
          </footer>
        </article>
      </dialog>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {
  notifications = inject(NotificationsStore);
}
