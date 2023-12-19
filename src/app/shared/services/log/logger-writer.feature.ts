import { Provider } from '@angular/core';
import { LogEntry } from './logger.type';

/**
 * Log writer interface
 */

export abstract class LogWriter {
  abstract write(entry: LogEntry): void;
}
/**
 * Default log writer
 */
const DEFAULT_WRITER: LogWriter = {
  write(entry: LogEntry): void {
    console.log(entry);
  },
};
/**
 * Logger feature provider
 * @param logWriter Log writer (optional with default value)
 * @returns a logger feature provider
 */

export function withWriter(logWriter: LogWriter = DEFAULT_WRITER): Provider {
  return [
    {
      provide: LogWriter,
      useValue: logWriter,
    },
  ];
}
