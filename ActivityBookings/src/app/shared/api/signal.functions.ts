import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

export type ApiTarget$<T, K> = (sourceValue: T) => Observable<K>;

/**
 * From a source signal, creates another with the result of a target observable
 * @param source The source signal to call the API target observable
 * @param apiTarget$ The API target observable called with the source value
 * @param initialValue An initial value for the returned signal
 * @returns A signal with the result of the API target observable
 */
export function toSignalMap<T, K>(source: Signal<T>, apiTarget$: ApiTarget$<T, K>, initialValue: K): Signal<K> {
  // 1 -> Convert source signal to an observable
  const source$ = toObservable(source);
  // 2 -> RxJs operators do the heavy work with other async calls and transformations
  const apiResult$ = source$.pipe(switchMap(apiTarget$));
  // 3 - > Convert back the observable into a signal usable from the template
  return toSignal(apiResult$, { initialValue });
}
