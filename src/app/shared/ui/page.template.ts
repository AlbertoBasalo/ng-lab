import { ChangeDetectionStrategy, Component, Input, computed, effect, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PageStore } from '@shared/services/page.store';
import { RunningStateComponent } from './status.component';

@Component({
  selector: 'lab-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RunningStateComponent],
  template: `
    <article>
      <header>
        <h2>{{ store.title() }}</h2>
        @if (hasSubtitle()) {
          <p>{{ store.subtitle() }}</p>
        }
      </header>
      <ng-content></ng-content>
      <footer>
        <ng-content select="footer"></ng-content>
        <lab-running-state [runningState]="store.runningState()" />
      </footer>
    </article>
  `,
})
export class PageTemplate {
  // Injection division
  #docTitle = inject(Title);
  // I/O division
  @Input() set title(title: string) {
    this.store.setTitle(title);
  }
  @Input() set subtitle(subtitle: string) {
    this.store.setSubtitle(subtitle);
  }
  @Input() store: PageStore = inject(PageStore);
  // Data division
  hasSubtitle = computed(() => !!this.store.subtitle());

  constructor() {
    effect(() => this.#docTitle.setTitle(this.store.title()));
  }
}
