import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Activity } from '@shared/domain/activity.type';
import { AuthStore } from '@shared/services/auth.store';
import { NewActivityForm } from './new-activity.form';
import { NewActivityService } from './new-activity.service';

@Component({
  standalone: true,
  imports: [CommonModule, NewActivityForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NewActivityService],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-new-activity (create)="onCreate($event)" />
      <footer>
        <p>{{ error }}</p>
      </footer>
    </article>
  `,
})
export default class NewActivityPage {
  #service = inject(NewActivityService);
  #authStore = inject(AuthStore);
  #router = inject(Router);
  title = 'Create a new activity';
  error = '';

  onCreate(activity: Partial<Activity>) {
    activity.userId = this.#authStore.user().id;
    this.#service.postActivity$(activity).subscribe({
      next: () => this.#router.navigate(['/activities']),
      error: (err) => (this.error = err.message),
    });
  }
}
