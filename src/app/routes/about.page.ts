import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ab-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h2>Just a demo project</h2>
    </section>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPage {}
