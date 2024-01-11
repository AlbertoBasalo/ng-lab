import { LogLevel } from '@log/logger.type';
import { AppConfig } from '@shared/services/app-config.provider';

export const environment: AppConfig = {
  logLevel: LogLevel.error,
  apiBaseUrl: 'https://api.activebookings.com',
  showAlertsToUser: true,
};
