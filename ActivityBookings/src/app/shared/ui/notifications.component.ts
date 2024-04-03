import { ChangeDetectionStrategy, Component, InputSignal, OutputEmitterRef, input, output } from '@angular/core';
import { Notification } from '@domain/notification.type';
/**
 * Component to show notifications to the user
 * @param {Notification[]} notifications The list of notifications to show
 * @emits close The event to close the notifications
 */
@Component({
  selector: 'lab-notifications',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <dialog open>
      <article>
        <header>
          <h2>Notifications</h2>
        </header>
        @for (notification of notifications(); track notification) {
          @if (notification.type === 'error') {
            <input disabled aria-invalid="true" [value]="notification.message" />
          } @else {
            <input disabled aria-invalid="false" [value]="notification.message" />
          }
        }
        <footer>
          <button (click)="close.emit()">Close</button>
        </footer>
      </article>
    </dialog>
  `,
})
export class NotificationsComponent {
  // * Inputs division

  /** The list of notifications to show */
  notifications: InputSignal<Notification[]> = input<Notification[]>([]);

  // * Outputs division

  /** The event to close the notifications */
  close: OutputEmitterRef<void> = output();
}
