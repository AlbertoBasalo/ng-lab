import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';

export type ApiTarget$<T, K> = (sourceValue: T) => Observable<K>;

export function toSignalMap<T, K>(
  source: Signal<T>,
  apiTarget$: ApiTarget$<T, K>,
  initialValue: K,
): Signal<K> {
  const source$ = toObservable(source);
  const apiResult$ = source$.pipe(switchMap(apiTarget$));
  return toSignal(apiResult$, { initialValue });
}
