import { ChangeDetectionStrategy, Component, InputSignal, Signal, computed, input } from '@angular/core';
import { Feedback, FeedbackStatus } from '@domain/feedback.type';

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
          <input disabled [value]="message()" />
          <button disabled aria-busy="true" class="outline">.</button>
        </fieldset>
      }
      @case ('success') {
        <input disabled aria-invalid="false" [value]="message()" />
      }
      @case ('error') {
        <input disabled aria-invalid="true" [value]="message()" />
      }
    }
  `,
})
export class FeedbackComponent {
  // * Inputs division

  /** Feedback status and user message */
  feedback: InputSignal<Feedback> = input.required<Feedback>();

  // * Computed properties division

  /** The status of the feedback */
  status: Signal<FeedbackStatus> = computed(() => this.feedback().status);
  /** The message of the feedback */
  message: Signal<string> = computed(() => this.feedback().message || this.feedback().status.toUpperCase());
}
