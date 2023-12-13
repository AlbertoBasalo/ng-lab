import { Injectable, Injector, Signal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandStatus, convertToSignal, createSignal } from './command.signal';

@Injectable({ providedIn: 'root' })
export class PageStore {
  #title = signal<string>('');
  #subtitle = signal<string>('');
  #status = createSignal({ status: 'idle', error: null });

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
    const signal = createSignal(initialValue);
    this.#connectStatus(signal);
    return signal;
  }

  addSourceToStatusSignal<T>(source$: Observable<T>, initial: T) {
    const signal = convertToSignal(source$, initial, this.injector);
    this.#connectStatus(signal);
    return signal;
  }

  #connectStatus(signal: Signal<CommandStatus>) {
    effect(() => this.#updateStatus(signal()), { allowSignalWrites: true });
  }

  #updateStatus(commandStatus: CommandStatus) {
    this.#status.update((s) => ({ ...s, ...commandStatus }));
  }
}
