import { InjectionToken } from '@angular/core';
import { LogLevel } from './log.service';

export type AppConfig = {
  logLevel: LogLevel;
  apiBaseUrl: string;
};

/** Application configuration */
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/**
 * Provides the application configuration
 * @param logLevel Minimum log level to display
 * @param apiBaseUrl Base url for the api
 */
export const provideAppConfig = (
  logLevel = LogLevel.debug,
  apiBaseUrl = 'http://localhost:3000',
) => {
  return {
    provide: APP_CONFIG,
    useValue: {
      logLevel,
      apiBaseUrl,
    },
  };
};
