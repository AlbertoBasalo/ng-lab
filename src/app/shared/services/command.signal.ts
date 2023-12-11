import { DestroyRef, Injector, Signal, WritableSignal, assertInInjectionContext, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 * The possible status of an observable command
 */
export type CommandStatus = 'pending' | 'success' | 'error' | 'idle';

/**
 * A structure representing the state of an observable command
 */
export type Command<T> = {
  /** The result value (initial or produced by the observable) command*/
  result: T;
  /** The error, if any, produced by the observable command*/
  error?: any;
  /** The status of the observable command*/
  status: CommandStatus;
};

/**
 * Creates a state signal for a given type
 * @param result initial value
 * @returns A writable signal with the state changes
 */
export function createSignal<T>(result: T): WritableSignal<Command<T>> {
  return signal<Command<T>>({ result, status: 'idle' });
}

/**
 * Connects a source observable to a state signal
 * @param source$ The observable command emitting the value
 * @param signal The command signal to update
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @see Command
 */
export function connect<T>(source$: Observable<T>, signal: WritableSignal<Command<T>>, injector?: Injector) {
  const destroyRef = getDestroyRef();
  signal.update((s) => ({ ...s, status: 'pending' }));
  source$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (result) => signal.update((s) => ({ ...s, result, status: 'success' })),
    error: (error) => signal.update((s) => ({ ...s, error, status: 'error' })),
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

/**
 * Converts an observable to a state signal
 * @param source$ The observable command emitting the value
 * @param value The initial value
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @returns A read-only signal with the command changes
 * @see Command
 */
export function toSignal<T>(source$: Observable<T>, value: T, injector?: Injector): Signal<Command<T>> {
  const state = createSignal<T>(value);
  connect(source$, state, injector);
  return state.asReadonly();
}
