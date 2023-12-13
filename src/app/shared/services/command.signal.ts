import { DestroyRef, Injector, Signal, WritableSignal, assertInInjectionContext, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 * The possible status of an observable command
 */
export type Status = 'working' | 'success' | 'error' | 'idle';

export type RunningStatus = {
  /** The status of the observable command*/
  status: Status;
  /** The error, if any, produced by the observable command*/
  error?: any;
};

/**
 * A structure representing the state of an observable command
 */
export type Command<T> = {
  /** The result value (initial or produced by the observable command)*/
  result: T;
} & RunningStatus;

/**
 * Creates a signal for command of a given type
 * @param initial initial value
 * @returns A writable signal with the state changes
 */
export function createCommand<T>(initial: T): WritableSignal<Command<T>> {
  return signal<Command<T>>({ result: initial, status: 'idle' });
}

/**
 * Connects a source observable to a command signal
 * @param source$ The observable command emitting the value
 * @param signal The command signal to update
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @see Command
 */
export function connectSourceToCommand<T>(
  source$: Observable<T>,
  signal: WritableSignal<Command<T>>,
  injector?: Injector,
) {
  const destroyRef = getDestroyRef();
  signal.update((s) => ({ ...s, status: 'working' }));
  source$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (result) => signal.update((s) => ({ ...s, result, status: 'success' })),
    error: (error) => signal.update((s) => ({ ...s, error, status: 'error' })),
  });
  /**
   * Gets the `DestroyRef` from the received or current injection context
   * @throws If not receiving and not running in an injection context
   */
  function getDestroyRef() {
    if (injector) return injector.get(DestroyRef);
    assertInInjectionContext(connectSourceToCommand);
    return inject(DestroyRef);
  }
}

/**
 * Converts an observable command to a command signal
 * @param source$ The observable command emitting the value
 * @param initial The initial value
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @returns A read-only signal with the command changes
 * @see Command
 */
export function convertSourceToCommand<T>(source$: Observable<T>, initial: T, injector?: Injector): Signal<Command<T>> {
  const signal = createCommand<T>(initial);
  connectSourceToCommand(source$, signal, injector);
  return signal.asReadonly();
}
