import { ChangeDetectionStrategy, Component, Injector, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { connectToCommandSignal } from '@shared/services/command.signal';
import { PageStore } from '@shared/services/page.store';
import { ErrorComponent } from '@shared/ui/error.component';
import { PageTemplate } from '@shared/ui/page.template';
import { NewActivityForm } from './new-activity.form';
import { NewActivityService } from './new-activity.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageTemplate, NewActivityForm, ErrorComponent],
  providers: [NewActivityService],
  template: `
    <lab-page [store]="store">
      <lab-new-activity (create)="onCreate($event)" />
    </lab-page>
  `,
})
export default class NewActivityPage {
  // Injection division
  readonly #injector = inject(Injector);
  readonly #router = inject(Router);
  readonly #service = inject(NewActivityService);
  readonly store = inject(PageStore);

  // Data division
  #postActivity = this.store.addNewStatusSignal<Activity>(NULL_ACTIVITY);

  // Life-cycle division
  constructor() {
    this.store.setTitle('Create a new activity');
    effect(() => this.#navigateAfterCreate());
  }

  // Event handlers division
  onCreate(activity: Partial<Activity>) {
    const source$ = this.#service.postActivity$(activity);
    connectToCommandSignal(source$, this.#postActivity, this.#injector);
  }

  // Effect handlers division
  #navigateAfterCreate() {
    if (this.#postActivity().status === 'success') {
      this.#router.navigate(['/activities']);
    }
  }
}
