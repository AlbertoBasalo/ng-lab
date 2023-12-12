import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Signal, TemplateRef, computed } from '@angular/core';

@Component({
  selector: 'lab-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <header>
        <h3>{{ title() }}</h3>
      </header>
      @for (item of items(); track item.id) {
        <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTemplate {
  @Input() name = '';
  @Input() items!: Signal<{ id: number }[]>;
  @Input() itemTemplate!: TemplateRef<any>;
  title = computed(() => (this.items().length > 0 ? `${this.items().length} ${this.name}` : `No ${this.name} found`));
}
