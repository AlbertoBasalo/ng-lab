import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';

/** The enumerated status of the feedback  */
export type FeedbackStatus = 'idle' | 'busy' | 'success' | 'error';

/** The feedback object */
export type Feedback = { status: FeedbackStatus; message: string };

/**
 * Component to give feedback to the user
 * @param {Feedback} feedback Feedback status and user message
 */
@Component({
  selector: 'lab-feedback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (status()) {
      @case ('busy') {
        <fieldset role="group">
          <input disabled [value]="message() || 'Busy'" />
          <button disabled aria-busy="true" class="outline">.</button>
        </fieldset>
      }
      @case ('success') {
        <input disabled aria-invalid="false" [value]="message() || 'Success'" />
      }
      @case ('error') {
        <input disabled aria-invalid="true" [value]="message() || 'Error'" />
      }
    }
  `,
})
export class FeedbackComponent {
  // * Inputs division

  /** Feedback status and user message */
  feedback: InputSignal<Feedback> = input<Feedback>({ status: 'idle', message: '' });

  // * Computed properties division

  /** The status of the feedback */
  status: Signal<FeedbackStatus> = computed(() => this.feedback().status);
  /** The message of the feedback */
  message: Signal<string> = computed(() => this.feedback().message);
}
