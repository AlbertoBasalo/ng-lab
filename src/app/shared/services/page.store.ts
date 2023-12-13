import { Injectable, Injector, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Command,
  RunningStatus,
  connectSourceToCommand,
  convertSourceToCommand,
  createCommand,
} from './command.signal';

@Injectable({ providedIn: 'root' })
export class PageStore {
  #title = signal<string>('');
  #subtitle = signal<string>('');
  #status = createCommand(null);

  title = computed(() => this.#title());
  subtitle = computed(() => this.#subtitle());
  status = computed(() => this.#status());

  constructor(protected injector: Injector) {}

  setTitle(title: string) {
    this.#title.set(title);
  }
  setSubtitle(subtitle: string) {
    this.#subtitle.set(subtitle);
  }

  addNewStatus<T>(initialValue: T) {
    const signal = createCommand(initialValue);
    this.#connectToStatus(signal);
    return signal;
  }

  connectSourceToStatus<T>(source$: Observable<T>, status: WritableSignal<Command<T>>) {
    connectSourceToCommand(source$, status, this.injector);
  }

  addSourceToStatus<T>(source$: Observable<T>, initial: T) {
    const signal = convertSourceToCommand(source$, initial, this.injector);
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
