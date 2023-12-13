import { ChangeDetectionStrategy, Component, Input, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageStore } from '@shared/services/page.store';
import { StatusComponent } from './status.component';

@Component({
  selector: 'lab-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [StatusComponent],
  template: `
    <article>
      <header>
        <h2>{{ store.title() }}</h2>
        @if (store.subtitle()) {
          <p>{{ store.subtitle() }}</p>
        }
      </header>
      <ng-content></ng-content>
      <footer>
        <ng-content select="footer"></ng-content>
        <lab-status [commandStatus]="store.status()" />
      </footer>
    </article>
  `,
})
export class PageTemplate {
  // I/O division
  @Input() set title(title: string) {
    this.store.setTitle(title);
  }
  @Input() set subtitle(subtitle: string) {
    this.store.setSubtitle(subtitle);
  }
  @Input() store: PageStore = inject(PageStore);
  // Injection division
  #title = inject(Title);

  constructor() {
    effect(() => this.#title.setTitle(this.store.title()));
  }
}
