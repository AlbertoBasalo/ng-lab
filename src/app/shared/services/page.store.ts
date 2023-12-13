import { Injectable, Injector, Signal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { RunningStatus, convertToCommandSignal, createCommandSignal } from './command.signal';

@Injectable({ providedIn: 'root' })
export class PageStore {
  #title = signal<string>('');
  #subtitle = signal<string>('');
  #status = createCommandSignal(null);

  title = computed(() => this.#title());
  subtitle = computed(() => this.#subtitle());
  status = computed(() => this.#status());

  constructor(private injector: Injector) {}

  setTitle(title: string) {
    this.#title.set(title);
  }
  setSubtitle(subtitle: string) {
    this.#subtitle.set(subtitle);
  }

  addNewStatusSignal<T>(initialValue: T) {
    const signal = createCommandSignal(initialValue);
    this.#connectToStatus(signal);
    return signal;
  }

  addSourceToStatusSignal<T>(source$: Observable<T>, initial: T) {
    const signal = convertToCommandSignal(source$, initial, this.injector);
    this.#connectToStatus(signal);
    return signal;
  }

  #connectToStatus(signal: Signal<RunningStatus>) {
    effect(() => this.#updateStatus(signal()), { allowSignalWrites: true });
  }

  #updateStatus(commandStatus: RunningStatus) {
    this.#status.update((s) => ({ ...s, ...commandStatus }));
  }
}
