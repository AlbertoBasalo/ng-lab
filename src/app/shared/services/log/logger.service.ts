import { Injectable, inject } from '@angular/core';
import { LogWriter } from './logger-writer.feature';
import { LOGGER_CONFIG } from './logger.config';
import { AppEvent, LogLevel } from './logger.type';

/**
 * Service to log messages for tracing and debugging purposes
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  #minLevel: LogLevel = inject(LOGGER_CONFIG).minLevel;
  #writer = inject(LogWriter);
  /**
   * Write a log entry
   * @param entry A log entry
   */
  log(entry: AppEvent): void {
    if (entry.level < this.#minLevel) return;
    this.#writer.write(entry);
  }
}
