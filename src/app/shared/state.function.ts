import { signal } from '@angular/core';
import { Observable } from 'rxjs';

export type State<T> = {
  value: T;
  error?: any;
  status: 'pending' | 'success' | 'error';
};

export function toState<T>(source$: Observable<T>, value: T) {
  const state = signal<State<T>>({ value, status: 'pending' });
  const subscription = source$.subscribe({
    next: (value) => {
      state.update((s) => ({ ...s, value, status: 'success' }));
      subscription.unsubscribe();
    },
    error: (error) => {
      state.update((s) => ({ ...s, error, status: 'error' }));
      subscription.unsubscribe();
    },
  });
  return state;
}
