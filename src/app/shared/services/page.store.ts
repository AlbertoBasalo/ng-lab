import { Injectable, Injector, Signal, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Command, RunningStatus, connectSourceToCommand, createCommand } from './command.signal';

/**
 * A store for page state
 * Provides basic state management for page title, subtitle and status (for async commands)
 * @description uses the command signal functionality to manage async commands
 * @summary Should be extended by concrete page stores to add specific state and commands
 */
@Injectable({ providedIn: 'root' })
export class PageStore {
  // State division
  #title = signal<string>('');
  #subtitle = signal<string>('');
  /** notifies changes on any running async command */
  #status = createCommand(null);

  // Selectors division
  title = computed(() => this.#title());
  subtitle = computed(() => this.#subtitle());
  status = computed(() => this.#status());

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
   * @param source$ An observable command
   * @param status An status signal to update
   */
  connectSourceToStatus<T>(source$: Observable<T>, status: WritableSignal<Command<T>>) {
    connectSourceToCommand(source$, status, this.injector);
  }

  /**
   * Creates a new status signal (to be connected to a source observable)
   * @param initialValue The initial value of the status
   * @returns A writable signal with the state changes
   */
  protected addNewStatus<T>(initialValue: T) {
    const signal = createCommand(initialValue);
    this.#connectToStatus(signal);
    return signal;
  }

  // Auxiliary methods division
  #connectToStatus(signal: Signal<RunningStatus>) {
    effect(() => this.#updateStatus(signal()), { allowSignalWrites: true });
  }

  #updateStatus(commandStatus: RunningStatus) {
    this.#status.update((s) => ({ ...s, ...commandStatus }));
  }
}
