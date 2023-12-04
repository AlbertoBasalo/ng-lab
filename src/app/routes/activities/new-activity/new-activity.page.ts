import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  WritableSignal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Activity, NULL_ACTIVITY } from '@shared/domain/activity.type';
import { State, connect } from '@shared/services/state.signal';
import { NewActivityForm } from './new-activity.form';
import { NewActivityService } from './new-activity.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NewActivityForm],
  providers: [NewActivityService],
  template: `
    <article>
      <header>
        <h2>{{ title }}</h2>
      </header>
      <lab-new-activity (create)="onCreate($event)" />
      <footer>
        <p>{{ error() }}</p>
      </footer>
    </article>
  `,
})
export default class NewActivityPage {
  // injection division

  #service = inject(NewActivityService);
  #router = inject(Router);
  #injector = inject(Injector);

  // component data division

  #postActivityState: WritableSignal<State<Activity>> = signal({
    status: 'idle',
    value: NULL_ACTIVITY,
  });

  // template data division

  title = 'Create a new activity';
  error = computed(() => this.#postActivityState().error);

  constructor() {
    effect(() => {
      if (this.#postActivityState().status === 'success')
        this.#router.navigate(['/activities']);
    });
  }

  // template event handlers division

  onCreate(activity: Partial<Activity>) {
    const source$ = this.#service.postActivity$(activity);
    connect(source$, this.#postActivityState, this.#injector);
  }
}
