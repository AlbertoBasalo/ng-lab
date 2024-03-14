import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

export type ApiTarget$<T, K> = (sourceValue: T) => Observable<K>;

/**
 * From a source signal, creates another signal with the result of a target observable based on the source signal value
 * @param source The source signal that triggers the call
 * @param apiTarget$ The API target observable called with the source signal value
 * @param initialValue An initial value for the returned signal, while the API call is in progress
 * @returns A signal with the result of the API target observable or the initial value
 */
export function toSignalMap<T, K>(source: Signal<T>, apiTarget$: ApiTarget$<T, K>, initialValue: K): Signal<K> {
  // 1 -> Convert source signal to an observable
  const source$ = toObservable(source);
  // 2 -> RxJs operators do the heavy work calling the API target observable
  const apiResult$ = source$.pipe(switchMap(apiTarget$));
  // 3 - > Convert back the observable into a signal usable from the template
  return toSignal(apiResult$, { initialValue });
}
