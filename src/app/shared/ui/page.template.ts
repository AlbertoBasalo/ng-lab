import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'lab-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
        <ng-content select=".subtitle"></ng-content>
      </header>
      <ng-content></ng-content>
      <ng-content select="footer"></ng-content>
    </article>
  `,
})
export class PageTemplate {
  // Injection division
  #docTitle = inject(Title);

  // I/O division
  @Input() set title(title: string) {
    this.#title = title;
    this.#docTitle.setTitle(title);
  }
  get title() {
    return this.#title;
  }
  #title = '';
}
