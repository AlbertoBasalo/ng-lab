import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from '@auth/auth.store';
import { LoggerService } from '@log/logger.service';
import { LogLevel } from '@log/logger.type';
import { Activity } from '@shared/domain/activity.type';
import { slugify } from '@shared/domain/slug.utils';
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
  readonly #logger = inject(LoggerService);
  readonly #authStore = inject(AuthStore);
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
    activity.userId = this.#authStore.userId();
    activity.slug = slugify(activity.name);
    activity.status = 'published';
    this.#store.postActivity(activity);
  }

  // Effects division
  #navigateAfterCreate() {
    if (this.postActivityStage() === 'success') {
      const logEntry = {
        level: LogLevel.info,
        message: 'Activity created successfully',
        payload: this.#store.postActivityResult(),
      };
      this.#logger.log(logEntry);
      this.#router.navigate(['/activities']);
    }
  }
}
