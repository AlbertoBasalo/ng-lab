import { LogLevel } from '@log/logger.type';
import { AppConfig } from '@shared/services/app-config.provider';

export const environment: AppConfig = {
  logLevel: LogLevel.debug,
  apiBaseUrl: 'http://localhost:3000',
  showAlertsToUser: false,
};
