import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '@shared/domain/activity.type';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { NewActivityForm } from './new-activity.form';
import { NewActivityStore } from './new-activity.store';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, NewActivityForm, ErrorComponent],
  providers: [NewActivityStore],
  template: `
    <lab-page [title]="title">
      <lab-new-activity (create)="onCreate($event)" />
      @if (postActivityStage() === 'error') {
        <lab-error [error]="postActivityError()" />
      }
    </lab-page>
  `,
})
export default class NewActivityPage {
  // Injection division
  readonly #router = inject(Router);
  readonly #store = inject(NewActivityStore);

  title = 'Create a new activity';
  postActivityStage = this.#store.postActivityStage;
  postActivityError = this.#store.postActivityError;

  // Life-cycle division
  constructor() {
    effect(() => this.#navigateAfterCreate());
  }

  // Event handlers division
  onCreate(activity: Partial<Activity>) {
    this.#store.postActivity(activity);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.postActivityStage() === 'success') {
      this.#router.navigate(['/activities']);
    }
  }
}
