import { Injectable, Injector, Signal, computed, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandStatus, createSignal, toSignal } from './command.signal';

@Injectable({ providedIn: 'root' })
export class PageStore {
  // ToDo: title, subtitle

  #commandStatus = createSignal({ status: 'idle', error: null });

  commandStatus = computed(() => this.#commandStatus());

  constructor(private injector: Injector) {}

  createSignal<T>(initialValue: T) {
    const signal = createSignal(initialValue);
    this.#connectCommandSignal(signal);
    return signal;
  }

  convert<T>(source$: Observable<T>, initial: T) {
    const signal = toSignal(source$, initial, this.injector);
    this.#connectCommandSignal(signal);
    return signal;
  }

  #connectCommandSignal(signal: Signal<CommandStatus>) {
    effect(
      () => {
        this.#updateCommandStatus(signal());
      },
      { allowSignalWrites: true },
    );
  }

  #updateCommandStatus(commandStatus: CommandStatus) {
    this.#commandStatus.update((s) => ({ ...s, ...commandStatus }));
  }
}
