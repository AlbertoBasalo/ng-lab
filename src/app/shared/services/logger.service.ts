import { Injectable, InjectionToken, Provider, inject, makeEnvironmentProviders } from '@angular/core';

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

export type LoggerConfig = {
  minLevel: LogLevel;
};

const DEFAULT_CONFIG = {
  minLevel: LogLevel.info,
};

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

/** Logger configuration token*/
export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('logger.config');

/**
 * Provides the application logger
 * @description This is a factory function with predefined values
 * @param loggerConfig The application configuration (optional with default values)
 */
export const provideLogger = (loggerConfig?: Partial<LoggerConfig>, writer?: Provider) => {
  const value = { ...DEFAULT_CONFIG, ...loggerConfig };
  const providers: Provider[] = [LoggerService, { provide: LOGGER_CONFIG, useValue: value }];
  if (writer) {
    providers.push(writer);
  }
  return makeEnvironmentProviders(providers);
};

/**
 * Service to log messages for tracing and debugging purposes
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  #minLevel: LogLevel = inject(LOGGER_CONFIG).minLevel;
  #writer = inject(LogWriter);

  // ToDo: make use of withFormatters or withLoggers

  /**
   * Write a log entry
   * @param entry A log entry
   */
  log(entry: LogEntry): void {
    if (entry.level < this.#minLevel) return;
    this.#writer.write(entry);
  }
}
