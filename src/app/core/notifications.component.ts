import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-notifications',
  standalone: true,
  imports: [],
  template: `
    <p>
      notifications works!
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationsComponent {

}
