import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { AuthInterceptor } from '@core/auth.interceptor';
import { BaseInterceptor } from '@core/base.interceptor';
import { provideErrorHandler } from '@core/error.service';

import { provideAppConfig } from '@shared/services/app-config.provider';

import { withWriter } from '@log/logger-writer.feature';
import { provideLogger } from '@log/logger.provider';
import { LogLevel } from '@log/logger.type';
import { routes } from './app.routes';
import { LabLogWriter } from './lab.log-writer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppConfig(),
    provideErrorHandler(),
    provideLogger({ minLevel: LogLevel.debug }, withWriter(new LabLogWriter())),
    provideHttpClient(withFetch(), withInterceptors([BaseInterceptor, AuthInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
