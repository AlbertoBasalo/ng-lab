import { Injectable, inject } from '@angular/core';
import { APP_CONFIG } from '../../core/app-config.provider';

export enum LogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}
export type LogEntry = {
  level: LogLevel;
  message: string;
  payload?: unknown;
  source?: string;
};

/**
 * Service to log messages for tracing and debugging purposes
 */
@Injectable({
  providedIn: 'root',
})
export class LogService {
  #level: LogLevel = inject(APP_CONFIG).logLevel;

  /**
   * Write a log entry
   * @param entry A log entry
   */
  log(entry: LogEntry): void {
    if (LogLevel[entry.level] < LogLevel[this.#level]) return;
    const entryMessage = `${entry.message} @ ${entry.source}`;
    switch (entry.level) {
      case LogLevel.debug:
        console.debug('🕵️ ' + entryMessage, entry.payload);
        break;
      case LogLevel.info:
        console.info('📘 ' + entryMessage, entry.payload);
        break;
      case LogLevel.warn:
        console.warn('☣️ ' + entryMessage, entry.payload);
        break;
      case LogLevel.error:
        console.error('🚒 ' + entryMessage, entry.payload);
        break;
    }
  }
}
