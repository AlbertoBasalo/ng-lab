import { ChangeDetectionStrategy, Component, Input, Signal } from '@angular/core';
import { CommandStatus } from '@shared/services/command.signal';
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
        @if (status) {
          <lab-status [commandStatus]="status()" />
        }
      </footer>
    </article>
  `,
})
export class PageTemplate {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() status?: Signal<CommandStatus>;
}
