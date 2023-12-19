import { InjectionToken } from '@angular/core';
import { LogLevel } from './logger.type';

export type LoggerConfig = {
  minLevel: LogLevel;
};
export const DEFAULT_CONFIG = {
  minLevel: LogLevel.info,
};
/** Logger configuration token*/

export const LOGGER_CONFIG = new InjectionToken<LoggerConfig>('logger.config');
