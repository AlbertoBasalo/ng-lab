import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ab-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      header works!
    </p>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

}
