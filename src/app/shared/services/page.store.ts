import { Injectable, Injector, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CommandState, RunningState, connectCommandToSignal, createCommandSignal } from './command.signal';

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
  /** notifies changes on any running async command */
  #commandsState = createCommandSignal(null);

  // Selectors division
  title = computed(() => this.#title());
  subtitle = computed(() => this.#subtitle());
  runningState = computed(() => this.#commandsState() as RunningState);

  constructor(protected injector: Injector) {}

  // Commands division
  setTitle(title: string) {
    this.#title.set(title);
  }
  setSubtitle(subtitle: string) {
    this.#subtitle.set(subtitle);
  }

  /**
   * Connects a source observable to a command signal
   * @param command$ An observable command
   * @param state A command state signal to be updated
   */
  connectCommandToState<T>(command$: Observable<T>, state: WritableSignal<CommandState<T>>) {
    connectCommandToSignal(command$, state, this.injector);
  }

  /**
   * Creates a new command state signal (to be connected to a source observable)
   * @param initialValue The initial value of the state
   * @returns A writable signal with the state changes
   */
  protected addNewState<T>(initialValue: T) {
    const signal = createCommandSignal(initialValue);
    this.#connectToRunningState(signal);
    return signal;
  }

  // Auxiliary methods division
  #connectToRunningState(signal: Signal<RunningState>) {
    effect(() => this.#updateRunningState(signal()), { allowSignalWrites: true });
  }
  #updateRunningState(runningState: RunningState) {
    console.log('runningState', runningState);
    this.#commandsState.update((s) => ({ ...s, ...runningState }));
  }
}
