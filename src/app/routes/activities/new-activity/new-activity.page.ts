import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '@shared/domain/activity.type';
import { PageTemplate } from '@shared/ui/page.template';
import { NewActivityForm } from './new-activity.form';
import { NewActivityPageStore } from './new-activity.page-store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, NewActivityForm],
  providers: [NewActivityPageStore],
  template: `
    <lab-page [store]="store">
      <lab-new-activity (create)="onCreate($event)" />
    </lab-page>
  `,
})
export default class NewActivityPage {
  // Injection division
  readonly #router = inject(Router);
  readonly store = inject(NewActivityPageStore);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Create a new activity');
    effect(() => this.#navigateAfterCreate());
  }

  // Event handlers division
  onCreate(activity: Partial<Activity>) {
    this.store.postActivity$(activity);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.store.postActivityStage() === 'success') {
      this.#router.navigate(['/activities']);
    }
  }
}
