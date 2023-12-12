import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CallStatus } from '@shared/services/command.signal';
import { StatusComponent } from './status.component';

@Component({
  selector: 'lab-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [StatusComponent],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
        @if (subtitle) {
          <p>{{ subtitle }}</p>
        }
      </header>
      <ng-content></ng-content>
      <footer>
        <ng-content select="footer"></ng-content>
        @if (callStatus) {
          <lab-status [callStatus]="callStatus" />
        }
      </footer>
    </article>
  `,
})
export class PageTemplate {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() callStatus?: CallStatus;
}
