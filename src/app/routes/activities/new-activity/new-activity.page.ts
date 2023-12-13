import { ChangeDetectionStrategy, Component, Injector, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { connect } from '@shared/services/command.signal';
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
    <lab-page [title]="title" [status]="status">
      <lab-new-activity (create)="onCreate($event)" />
    </lab-page>
  `,
})
export default class NewActivityPage {
  // injection division

  #service = inject(NewActivityService);
  #router = inject(Router);
  #injector = inject(Injector);
  #store = inject(PageStore);

  // component data division

  #postActivity = this.#store.createSignal<Activity>(NULL_ACTIVITY);

  // template data division

  title = 'Create a new activity';
  postActivity = computed(() => this.#postActivity());
  status = this.#store.commandStatus;
  constructor() {
    effect(() => {
      if (this.#postActivity().status === 'success') this.#router.navigate(['/activities']);
    });
  }

  // template event handlers division

  onCreate(activity: Partial<Activity>) {
    const source$ = this.#service.postActivity$(activity);
    connect(source$, this.#postActivity, this.#injector);
  }
}
