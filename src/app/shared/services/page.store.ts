import { Injectable, Injector, Signal, WritableSignal, computed, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandState, connectCommandToSignal, createCommandSignal } from './command.signal';

/**
 * A store for page state
 * Provides basic state management for page title, subtitle and running state for async commands
 * @description uses the command signal functionality to manage async commands
 * @summary Should be extended by concrete page stores to add specific state and commands
 */
@Injectable({ providedIn: 'root' })
export class PageStore {
  // State division
  #title = signal<string>('');
  #subtitle = signal<string>('');

  #commandsStates: Signal<CommandState<unknown>>[] = [];

  // Selectors division
  title = computed(() => this.#title());
  subtitle = computed(() => this.#subtitle());
  /** notifies changes on any running async command */
  runningStates = computed(() =>
    this.#commandsStates.filter((s) => s().stage !== 'idle').map((s) => s() as CommandState<unknown>),
  );

  constructor(protected injector: Injector) {}

  // Commands division
  setTitle(title: string) {
    this.#title.set(title);
  }
  setSubtitle(subtitle: string) {
    this.#subtitle.set(subtitle);
  }

  /**
   * Creates a new command state signal (to be connected to a source observable)
   * @param initialValue The initial value of the state
   * @returns A writable signal with the state changes
   */
  addState<T>(initialValue: T) {
    const signal = createCommandSignal(initialValue);
    this.#commandsStates.push(signal);
    return signal;
  }

  /**
   * Connects a source observable to a command signal
   * @param command$ An observable command
   * @param state A command state signal to be updated
   */
  dispatch<T>(command$: Observable<T>, state: WritableSignal<CommandState<T>>) {
    connectCommandToSignal(command$, state, this.injector);
  }
}
