import { signal } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * The possible status of an observable
 */
export type Status = 'pending' | 'success' | 'error';

/**
 * A structure representing the state of an observable
 */
export type State<T> = {
  /** The value (initial or produced by the observable) */
  value: T;
  /** The error if produced by the observable */
  error?: any;
  /** The status of the observable */
  status: Status;
};

/**
 * Converts an observable to a state signal
 * @param source$ The observable emitting the value
 * @param value The initial value
 * @returns A signal with the state wrapping the value and error of a command
 * @see State
 */
export function toState<T>(source$: Observable<T>, value: T) {
  const state = signal<State<T>>({ value, status: 'pending' });
  const subscription = source$.subscribe({
    next: (value) => {
      state.update((s) => ({ ...s, value, status: 'success' }));
    },
    error: (error) => {
      state.update((s) => ({ ...s, error, status: 'error' }));
      subscription.unsubscribe();
    },
    complete: () => {
      subscription.unsubscribe();
    }
  });
  return state.asReadonly();
}
