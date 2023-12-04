import {
  DestroyRef,
  Injector,
  Signal,
  WritableSignal,
  assertInInjectionContext,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
/**
 * The possible status of an observable command
 */
export type Status = 'pending' | 'success' | 'error' | 'idle';

/**
 * A structure representing the state of an observable
 */
export type State<T> = {
  /** The value (initial or produced by the observable) */
  value: T;
  /** The error, if any, produced by the observable */
  error?: any;
  /** The status of the observable */
  status: Status;
};

/**
 * Converts an observable to a state signal
 * @param source$ The observable emitting the value
 * @param value The initial value
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @returns A read-only signal with the state changes
 * @see State
 */
export function toState<T>(
  source$: Observable<T>,
  value: T,
  injector?: Injector,
): Signal<State<T>> {
  const destroyRef = getDestroyRef();
  const state = signal<State<T>>({ value, status: 'pending' });
  source$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (value) => state.update((s) => ({ ...s, value, status: 'success' })),
    error: (error) => state.update((s) => ({ ...s, error, status: 'error' })),
  });
  return state.asReadonly();

  /**
   * Gets the `DestroyRef` from the received or current injection context
   * @throws If not receiving or if not running in an injection context
   */
  function getDestroyRef() {
    injector || assertInInjectionContext(toState);
    const destroyRef = injector?.get(DestroyRef) || inject(DestroyRef);
    return destroyRef;
  }
}

/**
 * Connects a source observable to a state signal
 * @param source$ The observable emitting the value
 * @param state The state signal to update
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @see State
 */
export function connect<T>(
  source$: Observable<T>,
  state: WritableSignal<State<T>>,
  injector?: Injector,
) {
  const destroyRef = getDestroyRef();
  state.update((s) => ({ ...s, status: 'pending' }));
  source$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (value) => state.update((s) => ({ ...s, value, status: 'success' })),
    error: (error) => state.update((s) => ({ ...s, error, status: 'error' })),
  });

  /**
   * Gets the `DestroyRef` from the received or current injection context
   * @throws If not receiving or if not running in an injection context
   */
  function getDestroyRef() {
    injector || assertInInjectionContext(connect);
    const destroyRef = injector?.get(DestroyRef) || inject(DestroyRef);
    return destroyRef;
  }
}
