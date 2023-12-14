import { DestroyRef, Injector, Signal, WritableSignal, assertInInjectionContext, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

/**
 * The possible running states of an observable command
 */
export type RunningStages = 'idle' | 'working' | 'success' | 'error';
/**
 * The running state of an observable command
 * @description Contains the stages and the error, if any, produced by the observable command
 * @see RunningStages
 */
export type RunningState = {
  /** The running state of the observable command*/
  stage: RunningStages;
  /** The error, if any, produced by the observable command*/
  error?: any;
};

/**
 * A structure representing the state of an observable command
 */
export type CommandState<T> = {
  /** The result value (initial or produced by the observable command)*/
  result: T;
} & RunningState;

/**
 * Creates a signal for a command returning a given type
 * @param initial initial value
 * @returns A writable signal with the state changes
 */
export function createCommandSignal<T>(initial: T): WritableSignal<CommandState<T>> {
  return signal<CommandState<T>>({ result: initial, stage: 'idle' });
}

/**
 * Connects a source observable to a command state signal
 * @param command$ The observable command emitting the value
 * @param signal The command state signal to update
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @see CommandState
 */
export function connectCommandToSignal<T>(
  command$: Observable<T>,
  signal: WritableSignal<CommandState<T>>,
  injector?: Injector,
) {
  const destroyRef = getDestroyRef();
  signal.update((s) => ({ ...s, stage: 'working' }));
  command$.pipe(takeUntilDestroyed(destroyRef)).subscribe({
    next: (result) => signal.update((s) => ({ ...s, result, stage: 'success' })),
    error: (error) => signal.update((s) => ({ ...s, error, stage: 'error' })),
  });
  /**
   * Gets the `DestroyRef` from the received or current injection context
   * @throws If not receiving and not running in an injection context
   */
  function getDestroyRef() {
    if (injector) return injector.get(DestroyRef);
    assertInInjectionContext(connectCommandToSignal);
    return inject(DestroyRef);
  }
}

/**
 * Converts an observable command to a command state signal
 * @param command$ The observable command emitting the value
 * @param initial The initial value
 * @param injector Optional injector context to use to get the `DestroyRef`
 * @returns A read-only signal with the command changes
 * @see CommandState
 */
export function convertCommandToSignal<T>(
  command$: Observable<T>,
  initial: T,
  injector?: Injector,
): Signal<CommandState<T>> {
  const signal = createCommandSignal<T>(initial);
  connectCommandToSignal(command$, signal, injector);
  return signal.asReadonly();
}
