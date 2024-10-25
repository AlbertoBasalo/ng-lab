import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lab-about',
  standalone: true,
  imports: [],
  template: ` <p>about works!</p> `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutPage {}
